# block-calendar-in-advance

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/j-frost/block-calendar-in-advance)

> Will block Google Calendar into the future automatically.

## Installation

### General Use

There is a version of this script publicly available as a library. Here's how to set it up.

1. Go to [script.new](https://script.new/) and create a new Google Apps Script project.
1. Click the **+** next to **Libraries** and search for script ID `14Ik3cFF-UHgss_5yZKokAiLRMdKZVsn_ZVlP_LRVqo3pMkLNrone0Z4C`.
1. Choose the newest version number for a fixed deployment or HEAD if you want to always run the newest version.
1. Don't change the name. Click **Add**.
1. Click the **+** next to **Services**.
1. Select **Google Calendar API** from the list.
1. Don't change the name. Click **Add**.
1. (Optional) Make sure your script is running in your time zone. To do this,
    1. Click the gear icon (**Project Settings**).
    1. Enable the checkbox next to `Show "appsscript.json" manifest file in editor`.
    1. Switch back to the editor.
    1. There should now be a new file called `appsscript.json` for you to edit.
    1. Select it and you'll find the `timeZone` setting.

Finally, replace the function's code. Instead of

```javascript
function myFunction() {

}
```

put something like

```javascript
function myFunction() {
  blockcalendarinadvance.runWithConfig({
    numberOfDaysToBlock: 3, // number of days in future to create blocker events for, detaults to 4
    startOfWorkday: 7, // from when (= which hour of the day) to create blocker events on each day, defaults to 9
    endOfWorkday: 18, // until when (= which hour of the day) to create blocker events on each day, defaults to 17
    skipDays: [6, 7], // list of days to skip when creating blocker events, f.i. weekends (Monday = 1, ..., Sunday = 7), defaults to [6, 7] (Saturday and Sunday)
    event: {
      summary: 'My blocker event', // the "title" of the event (shows up on Google Calendar UI immediately), defaults to 'Do not book'
      description: "Jerry: Don't book this. Ever.", // the description of the Calendar event; use this to add hints on when this blocker may be ignored, defaults to "Please don't book this time slot unless absolutely necessary."
      colorId: '1', // the ID of the (custom) color you'd like the events to be created as (usually 1-9, but can differ depending on Calendar settings), defaults to the calendar's color
      useDefaultReminders: true, // whether to use default Calendar event reminders or not, defaults to false
    },
  });
}
```

In the above code, replace values as you see fit. You can also completely delete lines if you want to use the defaults; or comment them out with `//` at the start of the line. To test your settings, hit the **Save** button or CTRL+S, then click **Run**. The first time running you'll have to grant your script project access to Google Calendar.

Now check your Calendar for results!

To make the script run periodically, click on the clock icon (**Triggers**) in the left-most side bar. Create a new trigger. If you want it to run hourly, you can just leave the default settings as the are and hit **Save**.

### Developers

Open this project using the Gitpod link at the top and take a peek at `.gitpod.yml`. It details how to get the project running.

You'll need node.js and npm in your development environment; and to deploy your own version I strongly recommend you take a look at [@google/clasp](https://github.com/google/clasp).
