const messages = {
  app: {
    name: "Penguin Statistics",
    name_line1: "Penguin Statistics",
    name_line2: "",
  },
  server: {
    name: "Server",
    switch: "Switch Server",
    selected: "Selected",
    servers: {
      CN: "CN",
      US: "US",
      JP: "JP",
      KR: "KR",
    },
  },
  menu: {
    _beta: "Beta",
    home: "Home",
    search: "Search",
    report: {
      _name: "Report Drops",
      stage: "Select By Stage",
      recognition: "Recognition",
    },
    stats: {
      _name: "Drop Rates",
      stage: "By stage",
      item: "By item",
      advanced: "Advanced Query",
    },
    about: {
      _name: "About Penguin Statistics",
      members: "Team Members",
      contribute: "Contribute",
      changelog: "Change Log",
      contact: "Contact us",
      donate: "Donate",
      links: "Link Exchange",
      bulletin: "Notice",
      credits: "Credits",
    },
    siteStats: "Statistics at a Glance",
    planner: "Farming Strategy Planner",
    v1: "Visit Old Version",
    refreshData: "Reload",
    languages: "Language",
    settings: {
      name: "Settings",
      themeStyles: {
        name: "Change Themes",
        disabled: "(Disabled: Active Special Theme)",
        default: "Default Theme",
        miku2021: "Hatsune Miku 2021 Birthday Theme",
      },
      appearances: {
        name: "Change Color Appearance",
        system: "Follow System",
        dark: "Always Dark",
        light: "Always Light",
      },
    },
    overline: {
      planner: "ArkPlanner",
    },
  },
  meta: {
    details: "Details",
    loading: "Loading...",
    notfound: "???",
    footer: {
      copyright: {
        title: "License",
        content:
          "Data was collected by Penguin Statistics, licensed under a Creative Commons Attribution-NonCommercial 4.0 International License. In case of redistribution and transformation towards the material, you must give appropriate credit, provide a link to the license, indicate if changes were made, and may not use the material for commercial purposes.",
      },
      credit: "Penguin Statistics | {date}",
    },
    separator: ", ",
    quotation: {
      start: '"',
      end: '"',
    },
    boolean: {
      true: "Yes",
      false: "No",
    },
    hasNorNot: {
      true: "Yes",
      false: "No",
    },
    dialog: {
      cancel: "Cancel",
      confirm: "Confirm",
      submit: "Submit",
      save: "Save",
      close: "Close",
    },
    time: {
      minute: "{m}m",
      second: "{s}s",
    },
    isAre: "is | are",
    copyWarning: "\n\nData from Penguin Statistics ({site})",
  },
  stats: {
    headers: {
      pattern: "Pattern",
      stage: "Stage",
      apCost: "Sanity",
      item: "Item",
      itemDrops: "Aggregated Item Drops",
      times: "Samples",
      quantity: "Loots",
      percentage: "Percentage",
      apPPR: "Sanity Required Per Item",
      clearTime: "Shortest Clear Time",
      timeRange: "Time Range",
      itemPerTime: "Time Per Item",
      recruitTag: "Recruit Tag",
      recruitObservations: "Observations",
      recruitRecruits: "Recruits",
    },
    headerDesc: {
      apCost: "The Sanity required for the stage",
      quantity: "The sum of all drops in this stage",
      times: "The sum of the samples in this stage",
      percentage: "Expected drop rate. Calculated as (Loots / Samples)",
      patternPercentage:
        "Possibility to get this drop pattern. Calculated as (Loots / Samples)",
      apPPR: "Expected Sanity required for getting 1x of this item",
      clearTime:
        "The shortest possible time required to clear this stage, a.k.a. the time duration starting from the beginning of the combat to the appearance of the last enemy. Data source: [PRTS Wiki]({prtsLink}).",
      itemPerTime:
        'With the "Percentage" calculated, the expected amount of time required to acquire 1 item is calculated as (ClearTime / (Loots / Samples))',
      timeRange:
        'Due to the change of the drop table of this stage, the data in this row will only contain the data from the last change of the drop table, indicated as "Time Range"',
    },
    filter: {
      title: "Filter",
      indicator:
        "No Filter Applied | {count} Filter Applied | {count} Filters Applied",
      stats: "Post-filtered {filtered} / Original {total}",
      overview: "Filter Summary",
      type: {
        _name: "Stage Type",
        showPermanent: "Permanent",
        showActivity: "Event",
      },
      status: {
        _name: "Stage Status",
        onlyOpen: "Only show open stages",
      },
    },
    itemPreview: {
      more: "{count} stage(s) drop this item",
    },
    timeRange: {
      inBetween: "{0} to {1}",
      toPresent: "{date} until now",
      endsAt: "Before {date}",
      unknown: "Unknown",
      notSelected: "(not selected)",
    },
    trends: {
      name: "Historical Drop Data",
      set: {
        rate: "Drop Rate",
        sample: "Samples",
        drops: "Drops",
      },
    },
    lastUpdated: "Last updated at: {date}",
    site: {
      viewMore: "Learn More",
      total: {
        sanity: "Sanity consumed in all reports",
        report: "Total Drop Reports",
        items: "Total Item Drops",
      },
      stages: "Top Upload Stages",
      items: "Top Upload Items",
      all: "Full Time",
      "24hr": "Last 24hr",
      generating: {
        title: "Generating Site Statistics...",
        subtitle:
          "Neural Network Message: Due to high amount of data, site statistics need up to 5 minutes to calculate. Please come back later.",
        refresh: "Refresh Site Statistics",
      },
    },
  },
  contribute: {
    repo: "Project repositories: ",
    frontend: "Frontend",
    frontendV4: "Frontend v4",
    backend: "Backend",
    livehouse: "LiveHouse",
    recognizer: "Recognizer",
    newFolder: "Currently working hard creating the project repo...",
    caption:
      "Penguin Statistics is a community project and it wouldn't be possible without the support of our community. Please support us by starring our GitHub repositories. Issues and PRs are always welcome!",
    contribute_0:
      "If you have experience with any of the following, and want to contribute to Penguin Statistics, contact us at QQ group: 747099627 or Discord via the link below.",
    contribute_1: "This is a nonprofit and open source project",
    skills: {
      frontend: "Frontend Development (React)",
      backend: "Backend Development (Go, PostgreSQL)",
      mobile: "Mobile App Development (iOS, Android)",
      maintenance: "DevOps",
      design: "UI/UX Design",
      analysis: "Data Analysis",
      others: "...",
    },
  },
  fetch: {
    loading: "Fetching Latest Data...",
    chunk: {
      title: "Establishing connection to Level 2 neural network...",
      subtitle: "Fetching page modules and rendering view, please wait...",
    },
    failed: {
      title: "Failed to fetch resources",
      subtitle:
        "Unable to establish synchronized connection with neural network. Missing partial or all resources.",
      retry: "Retry",
      deploying:
        "Deploying latest version. This may last at its longest 5 minutes, please wait patiently.",
      error: {
        zones: "Zones Data",
        stages: "Stages Data",
        items: "Items Data",
        limitations: "Report Validation Rules",
        trends: "History Report Trends",
        globalMatrix: "Global Drop Data",
        personalMatrix: "Personal Drop Data",
        globalPatternMatrix: "Global Drop Pattern Data",
        personalPatternMatrix: "Personal Drop Pattern Data",
        stats: "Site Statistics",
        period: "Server Events",
        config: "Frontend Configuration",
      },
    },
  },
  report: {
    alert: {
      title: {
        first: "Failure Risk Detected",
        repeat: "Warning",
      },
      continue: {
        first: "Are you sure you want to submit this record?",
        repeat: "Confirm submitting this record?",
      },
      contact: {
        before:
          "If you are sure you got this drop in-game, submit this report and ",
        activator: "contact us.",
        after:
          "Please indicate the stage name and drops. A screenshot is preferred for verification purposes. Our team will mark your report appropiately after verifying it.",
      },
      causes: {
        noDrop: "No items selected.",
        limitation:
          "Your current submission has a large deviation from our existing data. This submission could be marked as a false report, removing it from our data set.",
      },
    },
    recognition: {
      step: {
        select: "Select Images",
        recognize: "Recognize",
        confirm: "Confirm",
        report: "Report",
      },
      tips: {
        fileTooBig: 'File "{name}" with size of {size}MB is too large',
        fileTooOld: 'File "{name}" was created before 36hrs ago',
        chooseImage: "Click or drag to add an image",
        dragImage: "Drag an image here",
        addImage: "Click to add an image",
        copyImage: "Right click or long press the image to share it",
        abnormal:
          '{count} image(s) have been "excluded" because they either failed to pass legibility test, or failed to be recognized',
        notImageFile: '"{files}" are not image files, ignored.',
        emptyResult: "No results available",
        unsatisfiedStart: "Unable to Start",
        emptyFile: "No images selected",
        hasInvalidFile: "Contains invalid file",
      },
      status: {
        success: "Success",
        warning: "Warning",
        error: "Error",
      },
      description:
        "Boost your upload efficiency by simply choosing your drop screenshots and let us handle the rest.",
      recognize: {
        noFilename: "No Filename",
        elapsed: "Elapsed",
        remaining: "Remaining",
        speed: "Avg Speed",
        imagePerSecond: "{count} images/sec",
      },
      confirm: {
        loadingImage: "Loading Screenshot Preview",
        overview: {
          _name: "Overview",
          total: "Recognized",
          success: "Passed",
          error: "Failed",
          count: "{count}",
          server: "Dataset Server",
          duration: "Avg Time Taken",
        },
        details: "Details",
        unknownStage: "Recognition Failed",
        abnormal: {
          error: "This image failed to pass the legibility test",
          fatal: "This image failed to be recognized",
          details: "List of Errors",
          hover: "Hover: see recognition results",
        },
        cherryPick: {
          disabled: "Unable to upload abnormal recognition result",
          accepted: "Upload this result",
          rejected: "Discard this result",
        },
        noResult: "No recognition results",
        submit: "Upload Selected (×{count}) Results",
        itemsTotal: "Items",
      },
      report: {
        title: "Report Details",
        total: "Total",
        submit: "Report {count} battle results",
        reporting: "Reporting in bulk...",
        allSucceeded: "{count} battle results successfully reported",
        partialSucceeded: "Only {count} battle results successfully reported",
        partialFailed:
          "{count} failed battle result reports. Please follow the troubleshooting steps below",
        partialFailedDesc: [
          "Check your network connection: The upload may be failed if the network connection is poor.",
          "In order to ensure that the entire site data set is not affected by external attacks, if you still cannot upload after multiple retries, your submission volume may have triggered the reporting limit. Please try again after 24 hours to upload the remaining drop reports.",
          "Your IP may be shared with others, because individuals cannot be located due to the nature of IP. In this case, please try to switch your mobile network or WiFi to retry recognition, or you can retry uploading after 24 hours.",
          "To prevent retransmission attacks, we will attach a timestamp to your request; if the time of your device is too far from the standard time, the upload may fail. Please try to calibrate the device time and try again.",
        ],
        caption:
          "Thanks for reporting. Your data will be revealed in the global dataset of website in 20 minutes at most because of cache.",
      },
      states: {
        pending: "Waiting for initialization...",
        initializing: "Initializing...",
        recognizing: "Recognizing...",
        rendering: "Rendering content...",
        submitting: "Submitting...",
      },
      cost: "Cost",
      filename: "Filename",
      result: "Result",
      queue: "Image Queue",
      start: "Recognize {count} images",
      progress: "Progress",
      submit: "Submit",
      retry: "Failed to submit. Retrying...",
      filter: "Filter",
      notices: {
        welcome: [
          "Image files will be recognized **locally** using **WebAssembly** technology. We will not upload images to our server.",
          "Please use screenshots taken within 36 hours that contains only 3-stars clear. Duplications will be detected and marked as *excluded*.",
          "Please do not report the first-clear of a stage, and do not only report the clears where you were lucky - report all clears.",
        ],
        confirm: [
          "Click the image to enlarge it for double-checking.",
          "Screenshots which passed the legibility test have already been checked for upload.",
          "With consideration of dataset accuracy, you are **disallowed** to check a screenshot that failed the legibility test for upload.",
        ],
      },
      exceptions: {
        "Fingerprint::Same": {
          title: "Duplicated Images",
          subtitle: "Check if you have selected duplicated images",
        },
        "FileTimestamp::TooClose": {
          title: "Screenshot Interval too close",
          subtitle: "Check if you have selected duplicated images",
        },
        "DropInfos::Violation": "Failed to pass result validation",
        "StageChar::LowConfidence": {
          title: "Error in stage recognition",
          subtitle:
            "Low confidence in the recognition result. Please check if the result is consistent with the screenshot.",
        },
        "DropQuantityChar::LowConfidence": {
          title: "Error in item quantity recognition",
          subtitle:
            "Low confidence in the recognition result. Please check if the result is consistent with the screenshot.",
        },
        "DropAreaDropsQuantity::NotFound": {
          title: "Failed to recognize the drop quantity",
          subtitle:
            "Pictures with poor resolution or quality may cause this problem. Please check if the image is compressed",
        },
        "DropAreaDrops::LowConfidence": {
          title: "Low Confidence Drop Item",
          subtitle:
            "Check if you have selected a screenshot in which its content includes a closed event",
        },
        "DropAreaDrops::Illegal": {
          title: "Illegal drops found",
          subtitle:
            "There should be no drop in this stage, but there are some in the screenshot. This is usually caused by event drop during non-event period",
        },
        "Result::False": {
          title:
            "Not a battle result screenshot, or an internal error occurred",
          subtitle:
            "If this is a battle result screenshot, please make sure the server you select is correct",
        },
        "Stage::NotFound": {
          title: "Cannot found any valid matching stage",
          subtitle:
            "Error in stage recognition, or we do not count drop for this stage",
        },
        "Stage::Illegal": {
          title: "Illegal stage",
          subtitle: "This stage is not opening now",
        },
        "3stars::False": "Suspected to be a non 3-stars clear",
        "Droptypes::Illegal": {
          title: "Illegal drop type",
          subtitle:
            "There are illegal drop types in the screenshot, like first-clear or return AP",
        },
        "Droptypes::NotFound": "Failed to find any drop type",
      },
    },
    rules: {
      item: {
        _name: "Item Quantities",
        now: 'Selected {quantity} {item} in "{stage}"',
        gte: 'Should have at minimum {should} "{item}" in "{stage}"',
        lte: 'Should have at maximum {should} "{item}" in "{stage}"',
        not: 'Should not have exactly {should} "{item}" in "{stage}"',
      },
      type: {
        _name: "Items",
        now: 'Selected {quantity} items in "{stage}"',
        gte: 'Should have at minimum {should} items in "{stage}"',
        lte: 'Should have at maximum {should} items in "{stage}"',
        not: 'Should not have exactly {should} items in "{stage}"',
      },
    },
    clear: "Clear",
    closedReason: {
      INVALID:
        "Unable to Report: This stage does not contain drop reporting metadata.",
      NOT_FOUND:
        "Stage Not Found: The stage does not exist in the server you have selected.",
      EXPIRED:
        "Not within Reportable Time Range: Either has the stage already closed or has not yet opened.",
    },
    furniture: "Furniture Drop: {state}",
    name: "Report",
    submit: "Submit",
    success: "Successfully submitted",
    unable: "Failed to submit: ",
    undo: "Recall",
    undoSuccess: "Successfully recalled submission",
    gacha: "Multiple results are allowed for the reports of this stage.",
    notices: {
      rule_1:
        "Report one clear at a time. Please double-check your drop selection.",
      rule_2:
        "If there are no drops, click submit directly without selecting any drops.",
      rule_3:
        "Please do not report the first-clear of a stage, and do not only report the clears where you were lucky - report all clears.",
      rule_4: "Please make sure that you refresh a 3-stars clear.",
      rule_5: "Please only submit drop data from the CN server.",
    },
    usage: "Increase drop amount by left click, decrease by right click",
  },
  mirrors: {
    global: {
      notification:
        "For performance concerns, we recommend you to use the global site {0}.",
    },
    cn: {
      notification:
        "For performance concerns, we recommend you to use the CN mirror site {0}.",
    },
    _notification: {
      ignore: {
        title: "Ignore Mirror Notification?",
        subtitle:
          "Are you sure you want to ignore all mirror optimization notifications? Performance issues may occur.",
      },
    },
  },
  settings: {
    storageIssue:
      'Storage issues detected. Application may malfunction. If this warning keeps showing, try to clear local storage by using "Reset All" under the "Settings" dialog in the menu.',
    category: {
      appearance: "Appearance",
      data: "Data",
      about: "About",
    },
    iosSystemSettings: "Language & Privacy Settings",
    optimization: {
      lowData: {
        title: "Low Data Mode",
        active: "Low Data Mode is Active",
        subtitle:
          "Low Data Mode will stop fetching nonessential resources, such as the zone backgrounds in stage selector and the website background, to help reduce network data use.",
      },
    },
    data: {
      server: "Local Data includes servers: ",
      size: "Local Data size: ",
      reset: {
        title: "Reset All",
        subtitle:
          "This operation will delete all local data and settings you have set. After the deletion, all settings will be reset to default, all data needs to be downloaded again, and the web page will be reloaded. Are you sure to continue?",
      },
    },
  },
  zone: {
    name: "Zone",
    types: {
      MAINLINE: "Main Theme",
      WEEKLY: "Supplies",
      ACTIVITY: "Event",
      ACTIVITY_OPEN: "Event (Opening)",
      ACTIVITY_CLOSED: "Event (Closed)",
      ACTIVITY_PENDING: "Event (Opening Soon)",
      ACTIVITY_PERMANENT: "Intermezzi & Side Story",
      GACHABOX: "Gachabox",
      RECRUIT: "Recruit",
    },
    subTypes: {
      2019: "2019",
      2020: "2020",
      2021: "2021",
      2022: "2022",
      AWAKENING_HOUR: {
        title: "Hour of an Awakening",
        subtitle: "Episode 0~3",
      },
      VISION_SHATTER: {
        title: "Shatter of a Vision",
        subtitle: "Episode 4~8",
      },
      DYING_SUN: {
        title: "Shadow of a Dying Sun",
        subtitle: "Episode 9~10",
      },
      INTERLUDE: "Intermezzi",
      SIDESTORY: "Side Story",
    },
    status: {
      0: "Open",
      1: "Closed",
      "-1": "Opening Soon",
      permanentOpen: "Permanent",
    },
    opensAt: "Event period: {0} - {1}",
  },
  stage: {
    name: "Stage",
    about: "About this Stage",
    apCost: "{apCost} AP required",
    actions: {
      _name: {
        selector: "Quick Access",
        selectorEmpty: "No Quick Access available",
        panel: "Quick Actions",
      },
      star: {
        name: "Starred",
        activate: "Star",
        activated: "Starred",
        deactivate: "Click to Cancel Star",
        empty: [
          "Currently you've not starred any stages",
          "You can star a stage by going to its 'Quick Access' section in its details panel.",
        ],
      },
      history: {
        name: "Recently Accessed",
        empty: [
          "No recent accessed stages available",
          "After you've visit any stage pages, a record will appear at here.",
        ],
        clear: "Clear",
      },
      links: {
        "prts-wiki": "Wiki",
        "map-arknights-com": "Maps",
      },
      advanced: {
        activator: "Do Advanced Query",
      },
    },
    loots: {
      NORMAL_DROP: "Regular",
      EXTRA_DROP: "Extra",
      SPECIAL_DROP: "Special",
      FURNITURE: "Furniture",
    },
    selector: {
      plannerExclude: "Exclude Planning Stages",
      excludeAll: "Exclude All",
      includeAll: "Include All",
      title: "Select Stage",
    },
  },
  planner: {
    notices: {
      autoExistence:
        "ArkPlanner will hide non-existing stages automatically now.",
    },
    options: {
      _name: "Options",
      byProduct: "Consider by-products",
      requireExp: "Large demand for EXP",
      requireLmb: "Large demand for LMD",
      excludeStage: {
        _name: "Excludes",
        title: "Select",
        selected: "Excluded {stages} stages",
      },
    },
    reset: {
      name: "Reset",
      success: "Successfully resetted chosen planner data",
      dialog: {
        title: "Reset Planner",
        subtitle:
          "This operation will reset the planner data and settings you choose. Are you sure to continue?",
        options: {
          options: {
            name: "Planning Options",
            indicator: "Will reset all Options",
          },
          excludes: {
            name: "Exclude Stages",
            indicator: "Will reset all Excludes",
          },
          items: {
            name: "Item Data",
            indicator: "Will reset all Item Data",
          },
        },
      },
    },
    actions: {
      _name: "Data",
      import: "Import",
      export: "Export",
      importExport: "@:(planner.actions.import)/@:(planner.actions.export)",
      calculate: "Calculate",
      calculating: "Calculating now...",
      link: {
        generate: "Generate Share Link",
        generating: "Generating...",
        share: "Share Link",
      },
      config: {
        _name: "Configuration Profile",
        share: "Share Configuration Profile",
        import: "Import from Configuration Profile",
      },
    },
    craft: {
      do: "Synthesize",
      unable: "Missing Mat.",
      errors: {
        title: "Missing Required Materials to Synthesize",
        notEnough:
          'Required {need}×"{item}" to synthesize, but only have {have}',
      },
      plans: {
        title: "Synthesize Plans",
        plan: 'Using {cost}×"{item}" to synthesize, remaining {remain}',
      },
      success: "Used {sourceItems} to synthesize {amount} {productItem}",
    },
    have: "Have",
    need: "Need",
    copy: "Copy to Clipboard",
    calculation: {
      title: "Calculation Result",
      tabs: {
        stages: "Stages",
        syntheses: "Syntheses",
        values: "Material Sanity Value",
      },
      lmb: "Estimated LMD income",
      sanity: "Estimated Sanity required",
      exp: "Estimated EXP from Battle Records",
      times: "battles",
      level: "Material Level",
      noStage: "No stage found.",
      noSyntheses: "No syntheses found.",
    },
  },
  item: {
    name: "Item",
    choose: {
      name: "Choose Item",
    },
    categories: {
      ACTIVITY_ITEM: "Event Items",
      CARD_EXP: "Battle Records",
      CHIP: "Chips",
      FURN: "Furniture",
      MATERIAL: "Materials",
    },
    related: "Related Items",
    undefined: "Unknown",
  },
  query: {
    panel: {
      builder: "Query Builder",
      results: "Query Results",
      footer: {
        cache:
          'The query result data now displaying is cached data. If you need to get the latest data, please "execute query" again.',
        disclaimer:
          'Any data produced by the "Advanced Query" function is protected by the "Data License Agreement" of this site. Penguin Statistics does not make any form of commitment or endorsement of any data produced.',
      },
    },
    title: {
      main: "Main Query",
      comparison: "Comparison Query #{index}",
    },
    type: {
      matrix: "Statistics",
      trend: "Trends",
    },
    selector: {
      item: {
        title: "Choose Item",
        subtitle:
          "Used to filter the query results by specified materials. When any filter is selected, no other filters can be selected in the same query. If you want to filter other parameters, you can do it by adding a comparison query.",
        unspecified: "Show All Item",
        selected: "Only Query Selected ({length})",
      },
      stage: {
        title: "Choose Stage",
        subtitle:
          "Used to filter the query results by specified materials. When any filter is selected, no other filters can be selected in the same query. If you want to filter other parameters, you can do it by adding a comparison query.",
      },
      timeRange: {
        title: "Choose Time Range",
        subtitle: "(Required) Limit query results in a specific time range.",
        presets: {
          title: "Presets",
          start: "Started",
          end: "Ended",
        },
      },
      interval: {
        title: "Segment Interval",
        subtitle: "Interval for segmenting historical trends.",
        unspecified: "No Segment",
      },
    },
    operation: {
      add: "Add Comparison Query",
      execute: "Execute Query",
      inProgress: "Executing Queries...",
    },
    result: {
      main: "Main Query Result",
      comparison: "Comparison Query #{index} Result",
      empty:
        "This query returned 0 results. Please check your query parameters.",
      hideTime: "Hide Detail Time",
    },
  },
  version: {
    upgrade: {
      title: "Version Outdated",
      subtitle:
        "The current client version has outdated due to upgrade. Please retry after upgrade",
      action: "Upgrade",
      unable: "Can't Upgrade?",
    },
  },
  notice: {
    failed: "Failed to load notice: {error}",
    loading: "Loading Notice...",
  },
  dataSource: {
    switch: "Data Source",
    global: "All",
    loginNotice: "Please log in before viewing personal drop data.",
    personal: "Personal",
    title: "Login Required",
  },
  matrixCategory: {
    switch: "Matrix Category",
    all: {
      label: "All",
      // tooltip: "All",
    },
    auto: {
      label: "Auto",
      tooltip: "Auto: Such Matrix Category contains data from third-party tools that automatically reports drop data.",
    },
    manual: {
      label: "Manual",
      tooltip: "Manual: Such Matrix Category contains data only from the \"Report Drops by Stage\" and \"Report Drops by Recognition\" features from Penguin Statistics site.",
    },
  },
  validator: {
    required: "Required",
  },
  quotes: {
    doYouKnow: ["Do You Know? Ptilopsis' feather is sooo cute! o(*≧▽≦)ツ"],
  },
  credits: {
    material: {
      title: "Content Credits",
      content: [
        "Penguin Statistics utilizes (including but not limited to) pictures, animations, audio, original text and other works for the purpose of better reflecting the corresponding elements in the game and enhance the user experience. The copyright of such works belongs to the provider of the game, Shanghai Hypergryph Network Technology Co., Ltd. and/or its affiliates, including but not limited to YOSTAR (HONG KONG) LIMITED, 株式会社Yostar, YOSTAR LIMITED, 龍成網路, etc,.",
        "Penguin Statistics utilizes some assets from PRTS Wiki (http://prts.wiki) and has changed some of the assets without modifying its original meaning.",
        'Penguin Statistics used the slightly self-modified version of the Bender font, provided by the Free Fonts Project under a usage basis claimed on the official website of the Project ( http://jovanny.ru ) of "All fonts from the Free Fonts Project can be used both for commercial and personal purposes without any limitations.". Penguin Statistics hereby specially thanks and appreciates the Bender font for releasing their awesome font under such license.',
      ],
    },
    source: {
      title: "Open Source Licenses",
    },
  },
  auth: {
    forgot: {
      activator: "Forgot PenguinID",
      title: "Can't Login?",
      subtitle: "Let's recover your login information",
      penguinIdHistory: {
        title: "Previously used PenguinID",
        lastLoginAt: "Last login at {time}",
        loginAsUserId: "Login as this PenguinID",
        deleteUserId: "Delete this PenguinID record",
        noData: "No Data",
        tips: "Only able to recover PenguinID that are used in client v3.3.1 or newer versions",
      },
    },
  },
  members: {
    categories: {
      owner: "Webmaster",
      maintainer: "Maintainer",
      contributors: "Contributors",
      others: "Others",
      translators: "Translators",
    },
    responsibilities: {
      _name: "Contributions",
      arkplanner: "Author of ArkPlanner",
      backend: "Backend",
      bulkupload: "Bulk Upload",
      customersupport: "User Support",
      v1frontend: "v1.0 Frontend",
      frontend: "Frontend",
      localization_en: "English Localization",
      localization_ja: "Japanese Localization",
      localization_ko: "Korean Localization",
      logo: "Logo Designer",
      maintenance: "DevOps",
      materials: "Materials Supplier",
      statistics: "Statistics and Analysis",
      widget: "Widget Development",
      native: "App Development",
      recognition: "Screenshot Recognition",
    },
    socials: {
      email: "Email",
      github: "GitHub",
      qq: "QQ",
      twitter: "Twitter",
      weibo: "Weibo",
    },
  },
  pattern: {
    name: "Drop Patterns",
    empty: "(No Drops)",
    error: ["Drop Patterns for this Stage", "Currently not Available"],
  },
  share: {
    name: "Share",
    shortlink: {
      name: "Short Link",
    },
    text: {
      _tmpl: "{name} Drop Rates on Penguin Statistics",
      stage: 'Stage "{name}"',
      item: 'Item "{name}"',
    },
    success: "Successfully shared",
  },
  search: {
    placeholder: "Search...",
    hint: "Type in Name for Stage, Zone or Item",
  },
  confirmLeave: {
    title: "Are you sure to leave?",
    subtitle: "Unsaved changes may lost.",
  },
  specials: {
    mikubirthday2021: {
      caption: "Happy Birthday Hatsune Miku",
    },
  },
};

export default Object.freeze(messages)
