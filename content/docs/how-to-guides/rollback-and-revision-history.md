---
title: Rollback & Revision History
icon: /docs/icons/tutorial.svg
---

Kestra stores the revision history of the flows which allows you to easily rollback to any older version of the flow. You can check out the older versions by going to the "Revisions" tab on the flow's page. By default, the page opens up comparing the last revised version of the flow with the present live version of the flow.

![revision_comparison](/docs/how-to-guides/rollback-and-revision-history/revision_comparison.png)

You can compare any two versions by choosing the appropriate version from the drop down on both the sides.

![revision_dropdown](/docs/how-to-guides/rollback-and-revision-history/revision_dropdown.png)

Both the code windows has a `Restore` button on top of them. You can rollback to the older version by clicking on the `Restore` button on top of the window that has the appropriate code you want to restore.

![restore_option](/docs/how-to-guides/rollback-and-revision-history/restore_option.png)

Note that the present live version will have the `Restore` button disabled as this version is already live and there is nothing to restore.
