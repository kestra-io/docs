import json
import logging
import os
import re
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from logging import Logger
from typing import Any, Callable, Optional

import amazon.ion.simpleion as ion
import dateutil.parser
import requests
from amazon.ion.simple_types import (
    IonPyBool,
    IonPyBytes,
    IonPyDecimal,
    IonPyDict,
    IonPyNull,
)

from exceptions import FailedExponentialBackoff


@dataclass(slots=True)
class FlowExecution:
    execution_id: str
    status: Optional[str]
    log: Optional[str]
    error: Optional[str]


class Kestra:
    """
    Kestra Class that is in charge of sending metrics, outputs, assets and logs to the
    Kestra server.

    Example - Set a counter:
        Kestra.counter("my_metric", 1)

    Example - Send an output:
        Kestra.outputs({"my_output": "my_value"})

    Example - Send an asset:
        Kestra.assets({
            "id": "my_asset",
            "type": "TABLE",
            "name": "MY_TABLE",
            "metadata": {
                "owner": "team-a"
            }
        })

    Example - Log an error:
        Kestra.logger().error("An error occurred")
    """

    _logger: Logger | None = None

    def __init__(self):
        pass

    @staticmethod
    def _send(map_: dict):
        """
        Send a message to the Kestra server through STDOUT print statement.

        Args:
            map_ (dict): The message to send to the Kestra server.
        """
        print(Kestra.format(map_))

    @staticmethod
    def format(map_: dict):
        """
        Format a message to be sent to the Kestra server.
        The kestra format is ::<message>::, where the message is a JSON object.

        Args:
            map_ (dict): The message to format into the Kestra format.

        Returns:
            str: The Kestra-formatted message.
        """
        return "::" + json.dumps(map_) + "::"

    @staticmethod
    def _metrics(
        name: str,
        type_: str,
        value: int,
        tags: dict | None = None,
    ):
        """
        Send a metrics to the Kestra server.

        Args:
            name (str): The name of the metric.
            type_ (str): The type of the metric.
            value (int): The value of the metric.
            tags (dict): The tags of the metric.
        """
        Kestra._send(
            {
                "metrics": [
                    {
                        "name": name,
                        "type": type_,
                        "value": value,
                        "tags": tags or {},
                    }
                ]
            }
        )

    @staticmethod
    def outputs(map_: dict):
        """
        The `Kestra` class provides a method to send key-value-based outputs to
        the Kestra server. If you want to output large objects, write them to a
        file and specify them within the `outputFiles` property of the Python
        script task.

        Args:
            map_ (dict): The outputs to send to the Kestra server.
        """
        Kestra._send({"outputs": map_})

    @staticmethod
    def assets(map_: dict):
        """
        The `Kestra` class provides a method to send a full asset to
        the Kestra server.

        Args:
            map_ (dict): The full asset properties to send to the Kestra server.
        """
        Kestra._send({"assets": map_})

    @staticmethod
    def counter(
        name: str,
        value: int,
        tags: dict | None = None,
    ):
        """
        The `Kestra` class provides a method to send counter metrics to the Kestra
        server.

        Args:
            name (str): The name of the counter.
            value (int): The value of the counter.
            tags (dict): The tags of the counter (optional).
        """
        Kestra._metrics(name, "counter", value, tags)

    @staticmethod
    def timer(
        name: str,
        duration: int | Callable,
        tags: dict | None = None,
    ):
        """
        The `Kestra` class provides a method to send timer metrics to the Kestra server.

        Args:
            name (str): The name of the timer.
            duration (int | Callable): The duration of the timer.
            tags (dict): The tags of the timer (optional).
        """
        if callable(duration):
            start = datetime.now()
            duration()
            Kestra._metrics(
                name,
                "timer",
                (datetime.now().microsecond - start.microsecond) / 1000,
                tags,
            )
        else:
            Kestra._metrics(name, "timer", duration, tags)

    @staticmethod
    def gauge(
        name: str,
        value: float,
        tags: dict | None = None,
    ):
        """
        The `Kestra` class provides a method to send gauge metrics to the Kestra server.

        Args:
            name (str): The name of the gauge.
            value (float): The value of the gauge.
            tags (dict): The tags of the gauge (optional).
        """
        Kestra._metrics(name, "gauge", value, tags)

    @staticmethod
    def logger():
        """
        Get the logger for the Kestra server.

        Returns:
            Logger: The logger for the Kestra server.
        """
        if Kestra._logger is not None:
            return Kestra._logger

        logger = logging.getLogger("Kestra")

        logger.setLevel(logging.DEBUG)

        stdOut = logging.StreamHandler(sys.stdout)
        stdOut.setLevel(logging.DEBUG)
        stdOut.addFilter(lambda record: record.levelno <= logging.INFO)
        stdOut.setFormatter(JsonFormatter())

        stdErr = logging.StreamHandler(sys.stderr)
        stdErr.setLevel(logging.WARNING)
        stdErr.setFormatter(JsonFormatter())

        logger.addHandler(stdOut)
        logger.addHandler(stdErr)

        Kestra._logger = logger

        return logger

    @staticmethod
    def _convert_ion_types(value: Any) -> Any:
        """
            Convert Ion types to Python types.

        Args:
            value (Any): The value to convert.

        Returns:
            Any: returns the converted value
        """
        if isinstance(value, IonPyNull):
            return None
        elif isinstance(value, IonPyDecimal):
            return float(value)
        elif isinstance(value, IonPyBool):
            return bool(value)
        elif isinstance(value, IonPyBytes):
            return value.decode("utf-8")
        elif isinstance(value, IonPyDict) or isinstance(value, dict):
            return {k: Kestra._convert_ion_types(v) for k, v in value.items()}
        elif isinstance(value, str):
            try:
                # Check if the value follows the expected format e.g. "LocalDateTime::'2024-04-21T13:43:24.34'"
                if value.startswith("LocalDateTime::"):
                    date_str = value.split("::")[1].strip('"')
                    return dateutil.parser.isoparse(date_str)
                # Use regex to check if the string is a valid ISO 8601 date
                iso_date_pattern = (
                    r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$"
                )
                if re.match(iso_date_pattern, value):
                    return dateutil.parser.isoparse(value)
                else:
                    raise ValueError("Not a valid LocalDatetime:: or ISO 8601 date")
            except ValueError:
                return value
        elif isinstance(value, list):
            return [Kestra._convert_ion_types(item) for item in value]
        else:
            return value

    @staticmethod
    def read(path_: str) -> list[dict[str, Any]]:
        """
        Read an Ion file and convert it to a list of dictionaries.

        Args:
            path_ (str): The path to the Ion file.

        Returns:
            list[dict[str, Any]]: returns the list of dictionaries
        """
        with open(path_, "rb") as file:
            ion_content = file.read()

        ion_data = ion.loads(ion_content, single_value=False)
        list_of_dicts = [dict(record) for record in ion_data]
        list_of_dicts = [
            {k: Kestra._convert_ion_types(v) for k, v in record.items()}
            for record in list_of_dicts
        ]

        return list_of_dicts


class LogFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        return (
            datetime.fromtimestamp(record.created, timezone.utc)
            .isoformat(sep="T", timespec="milliseconds")
            .replace("+00:00", "Z")
        )


class JsonFormatter(logging.Formatter):
    _formatter: LogFormatter = LogFormatter("%(asctime)s - %(message)s")

    @staticmethod
    def _logger_level(level: int) -> str:
        if level is logging.DEBUG:
            return "DEBUG"
        elif level is logging.INFO:
            return "INFO"
        elif level is logging.WARNING:
            return "WARN"
        elif (
            level is logging.ERROR
            or level is logging.CRITICAL
            or level is logging.FATAL
        ):
            return "ERROR"
        else:
            return "TRACE"

    def format(self, record: logging.LogRecord) -> str:
        result = {
            "logs": [
                {
                    "level": self._logger_level(record.levelno),
                    "message": self._formatter.format(record),
                }
            ]
        }

        return Kestra.format(result)


class Flow:
    """
    Execute a Kestra flow and optionally wait for its completion.

    Example — trigger a flow and wait for its completion:
        from kestra import Flow
        flow = Flow()
        flow.execute('mynamespace', 'myflow', {'param': 'value'})

    Example — set labels from inputs:
        from kestra import Flow
        flow = Flow(labels_from_inputs=True)
        flow.execute('mynamespace', 'myflow', {'param': 'value'})

    Example — pass a text file to an input of type FILE named 'myfile':
        from kestra import Flow
        flow = Flow()
        with open('example.txt', 'rb') as fh:
            flow.execute(
                'mynamespace',
                'myflow',
                {'files': ('myfile', fh, 'text/plain')}
            )

    Example — fire and forget:
        from kestra import Flow
        flow = Flow(wait_for_completion=False)
        flow.execute('mynamespace', 'myflow', {'param': 'value'})

    Example — overwrite the username and password:
        from kestra import Flow
        flow = Flow()
        flow.user = 'admin'
        flow.password = 'admin'
        flow.execute('mynamespace', 'myflow')

    Example — set the hostname, username and password using environment variables:
        from kestra import Flow
        import os

        os.environ["KESTRA_HOSTNAME"] = "http://localhost:8080"
        os.environ["KESTRA_USER"] = "admin"
        os.environ["KESTRA_PASSWORD"] = "admin"
        flow = Flow()
        flow.execute('mynamespace', 'myflow', {'param': 'value'})
    """

    def __init__(
        self,
        wait_for_completion: bool = True,
        poll_interval: int = 1,
        labels_from_inputs: bool = False,
        tenant: str | None = None,
    ) -> None:
        """
        Initialize the Flow class.

        The Flow class is used to execute a Kestra flow and optionally wait for its
        completion. It can also be used to get the status of an execution and the
        logs of an execution.

        Args:
            wait_for_completion (bool): Whether to wait for the flow to complete.
                Default is True.
            poll_interval (int): How often to poll the server for the status of the
                flow. Default is 1 second.
            labels_from_inputs (bool): Whether to use the inputs as execution label.
                Default is False.
            tenant (str): The tenant to use for the request (optional).

        Attributes:
            wait_for_completion (bool): Whether to wait for the flow to complete.
            poll_interval (int): How often to poll the server for the status of the
                flow.
            labels_from_inputs (bool): Whether to use the inputs as execution label.
            user (str): The username to use for the request.
                It is retrieved from the KESTRA_USER environment variable.
            hostname (str): The hostname of the Kestra server.
                It is retrieved from the KESTRA_HOSTNAME environment variable.
            api_token (str): The API token to use for the request.
                It is retrieved from the KESTRA_API_TOKEN environment variable.
            API_ENDPOINT_EXECUTION_CREATE (str): The endpoint to create an execution.
            API_ENDPOINT_EXECUTION_STATUS (str): The endpoint to get the status of an
                execution.
            API_ENDPOINT_EXECUTION_LOG (str): The endpoint to get the logs of an
                execution.
        """
        self.wait_for_completion = wait_for_completion
        self.poll_interval = poll_interval
        self.labels_from_inputs = labels_from_inputs
        self.user = os.environ.get("KESTRA_USER", None)
        self.hostname = os.environ.get("KESTRA_HOSTNAME", "http://localhost:8080")
        self.api_token = os.environ.get("KESTRA_API_TOKEN", None)

        if tenant is not None:
            self.API_ENDPOINT_EXECUTION_CREATE: str = (
                f"/api/v1/{tenant}/executions/{{namespace}}/{{flow_id}}"
            )
            self.API_ENDPOINT_EXECUTION_STATUS: str = (
                f"/api/v1/{tenant}/executions/{{execution_id}}"
            )
            self.API_ENDPOINT_EXECUTION_LOG: str = (
                f"/api/v1/{tenant}/logs/{{execution_id}}/download"
            )
        else:
            self.API_ENDPOINT_EXECUTION_CREATE: str = (
                "/api/v1/executions/{namespace}/{flow_id}"
            )
            self.API_ENDPOINT_EXECUTION_STATUS: str = (
                "/api/v1/executions/{execution_id}"
            )
            self.API_ENDPOINT_EXECUTION_LOG: str = (
                "/api/v1/logs/{execution_id}/download"
            )

    def _make_request(self, method: str, url: str, **kwargs) -> requests.Response:
        """
        Make a request to the Kestra server. Authentication is added in the following
        order:
        1. If an API token is set, it is used.
        2. If username and password are set, they are used.
        3. If no authentication is set, the request is made without authentication
            (not recommended).

        The request is retried up to 5 times with an exponential backoff. The retry
        codes are:
        408: Request timeout
        429: Too many requests
        500: Internal server error
        502: Bad gateway
        503: Service unavailable
        504: Gateway timeout

        Args:
            method (str): The method to use for the request.
            url (str): The URL of the Kestra server.
            kwargs (dict): Additional arguments to pass to the request.

        Returns:
            requests.Response: The response from the server.
        """
        retries = 5
        retry_codes = {
            408,
            429,
            500,
            502,
            503,
            504,
        }

        for i in range(retries):
            if self.api_token is not None:
                kwargs["headers"] = {"Authorization": f"Bearer {self.api_token}"}
            elif self.user is not None and self.password is not None:
                kwargs["auth"] = (self.user, self.password)

            response = requests.request(method, url, **kwargs)
            if response.status_code == 401:
                raise Exception(
                    "Authentication required but not provided. Please set the username "
                    "and password."
                )
            elif response.status_code in retry_codes:
                time.sleep(2**i)
                continue

            response.raise_for_status()
            return response

        raise FailedExponentialBackoff("Failed to make the request after 5 retries")

    def check_status(self, execution_id: str) -> requests.Response:
        """
        Check the status of the execution

        Args:
            execution_id (str): The ID of the execution.

        Returns:
            requests.Response: The response from the server.
        """
        url = self.hostname + self.API_ENDPOINT_EXECUTION_STATUS.format(
            execution_id=execution_id
        )

        return self._make_request("get", url)

    def get_logs(self, execution_id: str) -> requests.Response:
        """
        Get the execution logs

        Args:
            execution_id (str): The ID of the execution.

        Returns:
            requests.Response: The response from the server.
        """
        url = self.hostname + self.API_ENDPOINT_EXECUTION_LOG.format(
            execution_id=execution_id
        )

        return self._make_request("get", url)

    def execute(
        self,
        namespace: str,
        flow: str,
        inputs: dict = None,
    ) -> FlowExecution:
        """
        Execute a Kestra flow and optionally wait for its completion.

        The process is the following:
        1. Create the execution
        2. If wait_for_completion is True:
            - Wait for the execution to entered finish state
                (SUCCESS, WARNING, FAILED, KILLED, CANCELLED)
            - Get the logs of the execution
            - Return the status, log and error of the execution
        3. If wait_for_completion is False:
            - Return a namedtuple with the status "STARTED"
        4. If the execution fails, an exception is raised

        Args:
            namespace (str): The namespace of the flow.
            flow (str): The name of the flow.
            inputs (dict): The inputs of the flow.

        Returns:
            namedtuple: A namedtuple containing the status, log and error of the flow.
        """
        if inputs is None:
            inputs = {}

        logging.debug(
            "Starting a flow %s in the namespace %s with parameters %s",
            flow,
            namespace,
            str(inputs),
        )

        url = self.hostname + self.API_ENDPOINT_EXECUTION_CREATE.format(
            namespace=namespace,
            flow_id=flow,
        )

        if self.labels_from_inputs and len(inputs) > 0:
            labels = "?"
            labels = "?" + "&".join(
                [f"labels={key}:{value}" for key, value in inputs.items()]
            )

            url += labels

            files = {}

            # If Tuples are passed, then it should be a File type
            # for example - ('myfile', fileObject, 'application/json')
            # If not, then it should be treated as a string
            for k, v in inputs.items():
                if isinstance(v, tuple):
                    files[k] = v
                else:
                    files[k] = (None, str(v))

            response = self._make_request("post", url, files=files).json()
        elif len(inputs) > 0:
            files = {}

            # If Tuples are passed, then it should be a File type
            # for example - ('myfile', fileObject, 'application/json')
            # If not, then it should be treated as a string
            for k, v in inputs.items():
                if isinstance(v, tuple):
                    files[k] = v
                else:
                    files[k] = (None, str(v))

            response = self._make_request("post", url, files=files).json()
        else:
            response = self._make_request("post", url).json()

        if "id" not in response:
            raise Exception("Starting execution failed: " + str(response))

        execution_id = response["id"]
        result = FlowExecution(execution_id, None, None, None)

        logging.info(
            "Successfully triggered the execution: %s/ui/executions/%s/%s/%s",
            self.hostname,
            namespace,
            flow,
            execution_id,
        )

        if self.wait_for_completion:
            while True:
                time.sleep(self.poll_interval)

                response = self.check_status(execution_id).json()

                log = self.get_logs(execution_id)

                if "SUCCESS" in response["state"]["current"]:
                    logging.info(
                        "Execution of the flow %s in the namespace %s with parameters "
                        "%s was successful \n%s",
                        flow,
                        namespace,
                        str(inputs),
                        str(log.text),
                    )
                    result.status = response["state"]["current"]
                    result.log = str(log.text)
                    result.error = None

                    return result
                elif "WARNING" in response["state"]["current"]:
                    logging.warning(
                        "Execution of the flow %s in the namespace %s with parameters "
                        "%s finished with warnings \n%s",
                        flow,
                        namespace,
                        str(inputs),
                        str(log.text),
                    )
                    result.status = response["state"]["current"]
                    result.log = str(log.text)
                    result.error = None

                    return result
                elif "FAILED" in response["state"]["current"]:
                    logging.error(
                        "Execution of the flow %s in the namespace %s with parameters "
                        "%s failed \n%s",
                        flow,
                        namespace,
                        str(inputs),
                        str(log.text),
                    )
                    result.status = response["state"]["current"]
                    result.log = str(log.text)
                    result.error = None

                    return result
                elif "KILLED" in response["state"]["current"]:
                    logging.warning(
                        "Execution of the flow %s in the namespace %s with parameters "
                        "%s has been killed \n%s",
                        flow,
                        namespace,
                        str(inputs),
                        str(log.text),
                    )
                    result.status = response["state"]["current"]
                    result.log = str(log.text)
                    result.error = None

                    return result
                elif "CANCELLED" in response["state"]["current"]:
                    logging.warning(
                        "Execution of the flow %s in the namespace %s with parameters "
                        "%s has been cancelled \n%s",
                        flow,
                        namespace,
                        str(inputs),
                        str(log.text),
                    )
                    result.status = response["state"]["current"]
                    result.log = str(log.text)
                    result.error = None

                    return result
        else:
            result.status = "STARTED"
            result.log = None
            result.error = None

        return result
