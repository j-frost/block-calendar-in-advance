# block-calendar-in-advance

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/.../...)

> Will block Google Calendar into the future automatically. 

By default, this script will create events for any free time slots in the next three days, so as to prevent people from booking these slots. 

Simply connect it to your own AppsScript project (using [@google/clasp](https://github.com/google/clasp) is recommended for this) and set the project to auto-execute `blockCalendarInAdvance` once a day. 
