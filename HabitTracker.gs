/**
 * @OnlyCurrentDoc
 *
 * The above comment directs App Script to confine the script's activities to the
 * current document.
 */

/**
 * The main function to set up the entire Habit Tracker application.
 * Running this function will build the sheets, UI, and set up triggers.
 */
function initializeHabitTracker() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. ARCHITECTURE
  setupSheets(ss);
  
  // 2. UI & VISUALS
  setupDashboardUI(ss);
  setupSettingsSheet(ss);
  
  // 3. LOGIC & PROTECTION
  setupDataAndProtection(ss);
  
  // 4. AUTOMATION
  createTriggers();
  
  SpreadsheetApp.getUi().alert('Habit Tracker Initialized!', 'The initial setup is complete. Please refresh the sheet to see the "Habit Pro" menu.', SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Creates the necessary sheets and hides the system sheets.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss The active spreadsheet.
 */
function setupSheets(ss) {
  const sheetNames = ["Dashboard", "System_Data", "Settings"];
  sheetNames.forEach(name => {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
    }
  });
  
  ss.getSheetByName("System_Data").hideSheet();
  ss.getSheetByName("Settings").hideSheet();
}

/**
 * Configures the Dashboard's appearance, including the donut chart.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss The active spreadsheet.
 */
function setupDashboardUI(ss) {
  const dashboard = ss.getSheetByName("Dashboard");
  
  // Clean up the dashboard look
  dashboard.setGridlinesVisible(false);
  dashboard.hideRows(101, dashboard.getMaxRows() - 100);
  dashboard.getRange("A1:Z1000").setBackground("#f3f3f3");

  // Header
  dashboard.getRange("B2:H2").merge().setValue("WEEKLY HABIT PROGRESS")
    .setBackground("#333333").setFontColor("white")
    .setHorizontalAlignment("center").setVerticalAlignment("middle")
    .setFontWeight("bold");

  // Donut Chart Area
  dashboard.getRange("B4:D10").merge().setFormula(
    '=SPARKLINE({INDIRECT("System_Data!B2"), INDIRECT("System_Data!C2")-INDIRECT("System_Data!B2")}, {"charttype","pie";"colors","\'#00FF00\',\'#E0E0E0\'"})'
  ).setHorizontalAlignment("center").setVerticalAlignment("middle");
  dashboard.getRange("E4:H10").merge().setValue("Your progress will appear here as you check off habits.")
      .setHorizontalAlignment("center").setVerticalAlignment("middle").setFontColor("#666666");


  // Habit Checkbox Area
  const headerRange = dashboard.getRange("B14:H14");
  headerRange.setBackground("#333333").setFontColor("white").setFontWeight("bold");
  const days = ["Habit", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  headerRange.setValues([days]);
  
  const checkboxRange = dashboard.getRange("C15:H30");
  checkboxRange.insertCheckboxes();
}

/**
 * Sets up the Settings sheet with controls for habits.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss The active spreadsheet.
 */
function setupSettingsSheet(ss) {
  const settings = ss.getSheetByName("Settings");
  settings.getRange("B2").setValue("Habit Control Center").setFontWeight("bold");
  settings.getRange("B3").setValue("Enter up to 15 habits below:");
  
  // Link habits from Settings to Dashboard
  const dashboard = ss.getSheetByName("Dashboard");
  for (let i = 1; i <= 15; i++) {
    dashboard.getRange(`B${14 + i}`).setFormula(`=IF(ISBLANK(Settings!B${3+i}), "", Settings!B${3+i})`);
  }
}

/**
 * Sets up the System_Data sheet and protects ranges.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss The active spreadsheet.
 */
function setupDataAndProtection(ss) {
  const systemData = ss.getSheetByName("System_Data");
  systemData.getRange("A1").setValue("Master Streak Data").setFontWeight("bold");
  systemData.getRange("B1").setValue("CurrentProgress");
  systemData.getRange("C1").setValue("MaxProgress");
  systemData.getRange("B2").setValue(0); // Current Progress
  systemData.getRange("C2").setFormula("=COUNTA(Settings!B4:B18) * 7"); // Max Progress

  // Protect all sheets except the checkbox area on the dashboard
  const dashboard = ss.getSheetByName("Dashboard");
  const protection = dashboard.protect().setDescription('Dashboard Protection');
  const unprotectedRanges = [dashboard.getRange("C15:H30")];
  protection.setUnprotectedRanges(unprotectedRanges);
  
  // Remove all other editors from the protected range
  const editors = protection.getEditors();
  protection.removeEditors(editors);
}


/**
 * Creates the "Habit Pro" menu on sheet open.
 */
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Habit Pro')
      .addItem('Sync to Mobile', 'syncToMobile')
      .addItem('Reset Weekly Data', 'resetWeekly')
      .addToUi();
}

/**
 * An onEdit trigger to update the progress when a checkbox is clicked.
 * @param {Object} e The event object.
 */
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  
  if (sheet.getName() === "Dashboard" && range.getColumn() >= 3 && range.getColumn() <= 8 && range.getRow() >= 15 && range.getRow() <= 30) {
    updateProgress();
  }
}

/**
 * Updates the progress on the System_Data sheet.
 */
function updateProgress() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName("Dashboard");
  const systemData = ss.getSheetByName("System_Data");
  
  const checkboxRange = dashboard.getRange("C15:H30");
  const values = checkboxRange.getValues();
  
  let checkedCount = 0;
  for (let r = 0; r < values.length; r++) {
    for (let c = 0; c < values[r].length; c++) {
      if (values[r][c] === true) {
        checkedCount++;
      }
    }
  }
  
  systemData.getRange("B2").setValue(checkedCount);
}

/**
 * Creates triggers for onEdit and weekly reset.
 */
function createTriggers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Delete existing triggers to avoid duplicates
  const allTriggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }

  // Create new triggers
  ScriptApp.newTrigger('onEdit')
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  ScriptApp.newTrigger('resetWeekly')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(23) // 11 PM on Sunday
    .create();
}

/**
 * Reformats the dashboard for mobile viewing.
 */
function syncToMobile() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dashboard');
    sheet.setColumnWidth(1, 20); // Narrow A
    sheet.setColumnWidth(2, 200); // Habit Name
    sheet.setColumnWidth(3, 40); 
    sheet.setColumnWidth(4, 40);
    sheet.setColumnWidth(5, 40);
    sheet.setColumnWidth(6, 40);
    sheet.setColumnWidth(7, 40);
    sheet.setColumnWidth(8, 40);
    SpreadsheetApp.getUi().alert('Mobile Sync', 'Dashboard has been formatted for mobile viewing.', SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Archives data and resets the checkboxes for the new week.
 */
function resetWeekly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName("Dashboard");
  const systemData = ss.getSheetByName("System_Data");

  // Archive data (simple version: could be expanded to log history)
  const currentProgress = systemData.getRange("B2").getValue();
  const maxProgress = systemData.getRange("C2").getValue();
  const archiveDate = new Date();
  
  systemData.appendRow([`Archived on ${archiveDate.toLocaleDateString()}`, `Progress: ${currentProgress}/${maxProgress}`]);

  // Clear checkboxes
  dashboard.getRange("C15:H30").clearContent();

  // Reset progress counter
  systemData.getRange("B2").setValue(0);
  
  SpreadsheetApp.getUi().alert('Weekly Reset Complete', 'Last week\'s data has been archived and the new week is ready.', SpreadsheetApp.getUi().ButtonSet.OK);
}
