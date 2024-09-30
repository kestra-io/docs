---
title: Connect Google Sheets to Kestra
icon: /docs/icons/gsheets.svg
stage: Getting Started
topics:
  - Integrations
---

Learn step-by-step how to read data from a Google Sheet inside of a Kestra flow.

You can use any Google Sheet for this tutorial. In case you do not have Google Sheet, you can:

1. Download the data from [this link](https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv) and save it locally as `orders.csv` file.
2. Create a new Google Sheet.
3. Navigate to the `File` menu on the top, and select `Import` option.
4. Navigate to the `Upload` tab, and click on the `Browse` button.
5. Select the recently created `orders.csv` file, and click on `Open` button at the bottom of the popup.
6. On the `Import file` popup, choose the import location as `Replace spreadsheet` and separator type as `Detect automatically`. In this case, it does not matter whether you check or uncheck the box `Convert text to numbers, dates, and formulas`. Click on `Import data` button.
7. The contents of the file will be populated in the spreadsheet.
8. You can put an appropriate title to the spreadsheet, and name the sheet containing the order records as `orders`.

![sheet_import](/docs/how-to-guides/google-sheets/sheet_import.png)

![sheet_upload](/docs/how-to-guides/google-sheets/sheet_upload.png)

![sheet_import_data](/docs/how-to-guides/google-sheets/sheet_import_data.png)

![sheet_uploaded_data](/docs/how-to-guides/google-sheets/sheet_uploaded_data.png)

Now that we have the spreadsheet ready, let us proceed to assign appropriate authorization for the spreadsheet. For this:

1. Go to the GCP console, navigate to the [IAM service](https://console.cloud.google.com/iam-admin/iam).
2. Select `Service accounts` from the left navigation menu.
3. Click on `Create Service Account` on the top. You may choose to use an existing service account in which case you can skip the next step.
4. Put in appropriate service account name, service account id (the auto-populated value should be good to start with) and service account description, and click on `Done`.

![create_service_account_1](/docs/how-to-guides/google-sheets/create_service_account_1.png)

![create_service_account_2](/docs/how-to-guides/google-sheets/create_service_account_2.png)

The new service account has been created. Let's add a key to the service account.

1. Click on the corresponding service account from the Service Accounts page.
2. Navigate to `Keys` tab, and click on `Add Key` -> `Create new key`.
3. On the `Create private key` popup, select `JSON` option, and click on `Create`.
4. This will download the service account JSON file on your local computer.
5. Provide this JSON file's content as the secret.
  a. With Kestra EE, provide the secret key `GCP_SERVICE_ACCOUNT_JSON` and the file contents as the value.
  b. For docker-based Kestra instance, convert the JSON file's contents into base64 encoded format using `cat <private_key_file>.json | base64` and then provide the secret value as part of the environment file to the docker instance: `SECRET_GCP_SERVICE_ACCOUNT_JSON=<base64_encoded_value_for_json_file_contents>`.

Detailed instructions on creating service account can also be found [here](./google-credentials.md).

![create_new_key](/docs/how-to-guides/google-sheets/create_new_key.png)

We will now provide access to the spreadsheet for the service account.

1. Copy the email corresponding to the service account from the Service Accounts page.
2. Go to the spreadsheet, and click on the `Share` button on the top right.
3. Add the service account email in the `Add people, groups, and calendar events` text box.
4. You can give the `Viewer` access to the service account.
5. Click on `Done`.

Let us now enable the Google Sheets API in the GCP console.

1. On the GCP console, search for `Google Sheets API` service, or directly navigate to one using [this link](https://console.cloud.google.com/marketplace/product/google/sheets.googleapis.com).
2. Check whether the Google Sheets API is already enabled. If not, you will see an `Enable` button on the page. Click on the `Enable` button.

![enable_google_sheets_api](/docs/how-to-guides/google-sheets/enable_google_sheets_api.png)

With this, we are all set to access the Google Spreadsheet from Kestra flow. Here is an example of how the Kestra flow might look like:

```yaml
id: gsheet
namespace: company.team

tasks:
  - id: read_gsheet
    type: io.kestra.plugin.googleworkspace.sheets.Read
    description: Read data from Google Spreadsheet
    spreadsheetId: "1U4AoiUrqiVaSIVcm_TwDc9RoKOdCULNGWxuC1vmDT_A"
    store: true
    valueRender: FORMATTED_VALUE
    serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    header: true
```

The `spreadsheetId` in the flow is the ID that is present in the spreadsheet URL. For the URL `https://docs.google.com/spreadsheets/d/1U4AoiUrqiVaSIVcm_TwDc9RoKOdCULNGWxuC1vmDT_A/edit`, the `spreadsheetId` will be `1U4AoiUrqiVaSIVcm_TwDc9RoKOdCULNGWxuC1vmDT_A`.

The `store : true` implies that the values read from the spreadsheet will be stored as a file in the Kestra's internal storage. In case, you only want to fetch the result, and not store them as a file in the Kestra's internal storage, you can use `fetch: true` instead.

The `serviceAccount` value is fetched from the secret store, and its value is the service account key's JSON file contents.

The `header: true` implies that the first line of the input contains the column headers.

In case you only want a few selected sheets to be read, you can provide the array of sheets as part of the attribute `selectedSheetsTitle` as follows:

```yaml
selectedSheetsTitle:
  - orders
  - products
```

Here is the output of executing the above Kestra flow:

![gsheet_read_output](/docs/how-to-guides/google-sheets/gsheet_read_output.png)

This is how Kestra's Google Workspace plugin can be used to read the spreadsheet with its Sheet's [`Read`](/plugins/plugin-googleworkspace/tasks/sheets/io.kestra.plugin.googleworkspace.sheets.read) task.
