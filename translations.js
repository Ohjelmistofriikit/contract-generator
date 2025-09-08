const locations = {
  fi: {
    "Helsingin käräjäoikeus": "pääkaupunkiseudulle",
    "Itä-Uudenmaan käräjäoikeus": "pääkaupunkiseudulle",
    "Länsi-Uudenmaan käräjäoikeus": "pääkaupunkiseudulle",
    "Etelä-Karjalan käräjäoikeus": "Etelä-Karjalassa",
    "Etelä-Savon käräjäoikeus": "Etelä-Savossa",
    "Kymenlaakson käräjäoikeus": "Kymenlaaksossa",
    "Pohjois-Karjalan käräjäoikeus": "Pohjois-Karjalassa",
    "Pohjois-Savon käräjäoikeus": "Pohjois-Savossa",
    "Päijät-Hämeen käräjäoikeus": "Päijät-Hämeessä",
    "Kainuun käräjäoikeus": "Kainuussa",
    "Lapin käräjäoikeus": "Lapissa",
    "Oulun käräjäoikeus": "Pohjois-Pohjanmaalla",
    "Ahvenanmaan käräjäoikeus": "Ahvenanmaalla",
    "Kanta-Hämeen käräjäoikeus": "Kanta-Hämeessä",
    "Pirkanmaan käräjäoikeus": "Pirkanmaalla",
    "Varsinais-Suomen käräjäoikeus": "Varsinais-Suomessa",
    "Etelä-Pohjanmaan käräjäoikeus": "Etelä-Pohjanmaalla",
    "Keski-Suomen käräjäoikeus": "Keski-Suomessa",
    "Pohjanmaan käräjäoikeus": "Pohjanmaalla",
    "Satakunnan käräjäoikeus": "Satakunnassa",
  },
  en: {
    "District Court of Helsinki": "Helsinki metropolitan area",
    "District Court of Eastern Uusimaa": "Helsinki metropolitan area",
    "District Court of Western Uusimaa": "Helsinki metropolitan area",
    "District Court of South Karelia": "South Karelia region",
    "District Court of South Savo": "South Savo region",
    "District Court of Kymenlaakso": "Kymenlaakso region",
    "District Court of North Karelia": "North Karelia region",
    "District Court of North Savo": "North Savo region",
    "District Court of Päijät-Häme": "Päijät-Häme region",
    "District Court of Kainuu": "Kainuu region",
    "District Court of Lapland": "Lapland",
    "District Court of Oulu": "North Ostrobothnia region",
    "District Court of Åland": "Åland Islands",
    "District Court of Kanta-Häme": "Kanta-Häme region",
    "District Court of Pirkanmaa": "Pirkanmaa region",
    "District Court of Southwest Finland": "Southwest Finland",
    "District Court of South Ostrobothnia": "South Ostrobothnia region",
    "District Court of Central Finland": "Central Finland",
    "District Court of Ostrobothnia": "Ostrobothnia",
    "District Court of Satakunta": "Satakunta",
  }
};

const translations = {
  fi: {
    choose: 'Valitse',

    // Hero section
    title: "Ohjelmistofriikkien Sopimuspohja",
    subtitle: "Juridisesti pätevä sopimus suoraan toimeksiantoon freelancerin ja loppuasiakkaan välille",
    startButton: "Luonnostele sopimus",
    benefit1: "Luotu lakitoimiston kanssa",
    benefit2: "Tiedonkäsittely paikallisesti laitteellasi",
    benefit3: "100% ilmainen kaikille",

    // How it works section
    howItWorks: "Näin se toimii",
    step1Title: "Täytä lomake",
    step1Desc: "Interaktiivinen lomake kysyy sinulta vain tarvittavat tiedot.",
    step2Title: "Lataa PDF",
    step2DescPart1: "Saat valmiin sopimuksen PDF-muodossa välittömästi. Valmis PDF näyttää esimerkiksi ",
    step2LinkText: "tältä",
    step3Title: "Allekirjoita",
    step3Desc: "Tarkista sopimus ja allekirjoita yhdessä asiakkaan kanssa.",
    importantNotice: "Tärkeä huomautus",
    disclaimer: "Ohjelmistofriikit ei vastaa sopimuksen käytöstä aiheutuvista seurauksista. Tarkista aina sopimuksen sisältö ennen allekirjoittamista.",
    openSource: "Sopimuspohja on avointa lähdekoodia",
    googledocLink: "https://docs.google.com/document/d/1JotIerKLs3uVF7vTsnuyz1EzujCtkTSfwnFcK7fxwyc/edit?usp=sharing",

    // Form sections
    formStart: "Luonnostele sopimus",
    billingBasis: "Laskutusperuste",
    contractParties: "Sopimuksen osapuolet",
    clientInfo: "Tilaajan tiedot",
    supplierInfo: "Freelancerin tiedot",
    contactPersons: "Yhteyshenkilöt",
    projectInfo: "Projektin tiedot",
    numberOfHours: "Tuntimäärä",
    terminationPeriod: "Irtisanomisaika",
    ipr: "Aineettomat oikeudet (IPR)",
    location: "Sijainti",
    workingHours: "Sallitut työajat",
    legendKarajaoikeus: "Riitatilanteen ratkaisu",
    otherTerms: "Muut ehdot",

    prefixKarajaoikeus: "Mahdolliset riidat ratkaistaan",

    // Billing options
    hourlyBilling: "Tuntilaskutus",
    projectBilling: "Urakkalaskutus",
    hourlyRate: "Tuntihinta",
    projectPrice: "Urakkahinta",
    paymentTerms: "Maksuaika",
    days: "päivää",
    hourlyRateLabel: "€/h",
    projectRateLabel: "€",
    vat: "ALV",

    // Continue buttons
    continueToClientInfo: "Jatka tilaajan tietoihin →",
    continueToSupplierInfo: "Jatka freelancerin tietoihin →",
    continueToProject: "Jatka projektin tietoihin →",
    continueToHours: "Jatka tuntimäärään →",
    continueToIPR: "Jatka aineettomiin oikeuksiin →",
    continueToLocation: "Jatka sijaintiin →",
    continueToWorkHours: "Jatka työaikoihin →",
    continueToWorkEquipment: "Jatka työvälineisiin →",
    continueToReferenceRights: "Jatka referenssioikeuteen →",
    continueToKarajaoikeus: "Jatka riidan ratkaisuun →",
    continueToMuut: "Jatka muihin ehtoihin →",
    continueToGenerate: "🖊️ Generoi PDF 🖊️",
    continue: "Jatka →",

    // Final button
    createContract: "Luo sopimus",

    // Progress
    progress: "Edistyminen",
    complete: "valmiina",

    // Form labels
    client: "Tilaaja",
    clientCompany: "Tilaaja",
    clientBusinessId: "Y-tunnus",
    supplierCompany: "Freelancerin yritys",
    supplierBusinessId: "Y-tunnus",
    clientContact: "Tilaajan yhteyshenkilö",
    supplierContact: "Freelancerin oma nimi",
    consultantRole: "Freelancerin rooli",
    buttonTextDownloadPDF: "Lataa PDF",

    clientEmail: "Sähköposti",
    clientPhone: "Puhelinnumero",
    supplierEmail: "Sähköposti",
    supplierPhone: "Puhelinnumero",
    freelancer: "Freelancer",

    // Validation messages
    emailRequired: "Sähköposti on pakollinen",
    emailInvalid: "Virheellinen sähköpostiosoite",
    phoneRequired: "Puhelinnumero on pakollinen",
    phoneInvalid: "Virheellinen puhelinnumero",
    ytunnusRequired: "Y-tunnus on pakollinen",
    ytunnusInvalid: "Virheellinen Y-tunnus",

    // Hours section
    agreedAllocation: "Sovittu allokaatio",
    zeroHourContract: "Nollatuntisopimus",
    hoursPerWeek: "tuntia viikossa keskimäärin",
    startDate: "päivämäärä jolloin työ alkaa",
    indefinite: "Sopimus pysyy voimassa toistaiseksi",
    fixedTerm: "Sopimus päättyy tietyn ajan jälkeen",
    endDate: "päivämäärä johon saakka sopimus on voimassa",
    averageHours: "Keskimäärin",
    hours: "tuntia",
    perWeek: "viikossa",
    startingFrom: "alkaen",
    endingOn: "päättyen",
    indefinitelyValid: "voimassa toistaiseksi",
    zeroHourContractLabel: "Nollatuntisopimus,",
    validUntil: "voimassa",
    until: "saakka",

    placeholderProjectName: "esim. Verkkokaupan kehitys tai Mobiilisovelluksen suunnittelu",
    inAdditionToHourlyRate: "€/h tuntihinnan päälle",
    inAdditionToFixedPrice: "€/h urakkahinnan päälle",
    placeholderInputWeeklyHours: "esim. 37.5",
    placeholderInputTravelArea: "pääkaupunkiseudulla",
    placeholderInputDistrictCourt: "Helsingin käräjäoikeudessa",

    placeholderInputClientCompany: "Pertin Puutavara Oy",
    placeholderInputClientContactPerson: "Pertti Perttunen",
    placeholderInputClientEmail: "pertti@pertinpuutavara.fi",
    placeholderInputFreelancerCompany: "Koodi Kuntoon oy",
    placeholderInputFreelancerContactPerson: "Kaija Koodari",
    placeholderInputFreelancerEmail: "kaija@koodikuntoon.fi",

    // Termination
    terminationPeriod: "Irtisanomisaika",
    terminationWeeks: "viikon irtisanomisaika",
    weeks: "viikkoa",

    // IPR
    iprGoesTo: "Aineettomat oikeudet menevät",
    supplierKeepsIPR: "freelancerille",
    clientKeepsIPR: "tilaajalle",
    radioClientKeepsIPR: "Tilaaja saa aineettomat oikeudet",
    radioSupplierKeepsIPR: "Freelancer saa aineettomat oikeudet",

    // Project Info
    prefixProject: "Freelancer konsultoi",
    inProject: "projektissa:",
    inRole: "roolissa",
    projectName: "Projektin nimi tai kuvaus",
    radioConsultantRoleSoftwareDeveloper: "Ohjelmistokehittäjä",
    radioConsultantRoleSoftwareDeveloperInflected: "ohjelmistokehittäjänä",
    radioConsultantRoleDesigner: "Designer",
    radioConsultantRoleDesignerInflected: "Designerina",
    radioConsultantRoleDevops: "DevOps",
    radioConsultantRoleDevopsInflected: "DevOps tehtävissä",
    radioConsultantRoleScrumMaster: "Scrum Master",
    radioConsultantRoleScrumMasterInflected: "Scrum Masterina",
    radioConsultantRoleProjectManagement: "Projektinjohto",
    radioConsultantRoleProjectManagementInflected: "projektinjohdon tehtävissä",
    radioConsultantRoleOther: "Muu",
    radioConsultantRoleOtherInflected: "määrittelemättömissä tehtävissä",

    // Location
    workRemotelyPart1: "Työ suoritetaan enimmäkseen",
    workRemotelyPart2: "etänä",
    workOnsitePart1: "Työ suoritetaan enimmäkseen läsnä",
    workOnsitePart2: "läsnä",

    // Working Hours
    flexibleWorkingHoursPart1: "Freelancer saa tehdä työtä",
    flexibleWorkingHoursPart2: "mihin kellonaikaan tahansa",
    flexibleWorkingHoursLabel: "Milloin vain: freelancer saa päättää itse",
    clientWorkingHoursPart1: "Työ suoritetaan",
    clientWorkingHoursPart2: "tilaajan normaalien työaikojen",
    clientWorkingHoursPart3: "puitteissa",
    clientWorkingHoursLabel: "Rajoitetut työajat: työ suoritetaan tilaajan normaalien työaikojen puitteissa",

    // Summary labels
    project: "Projekti",

    // Badge
    recommended: "SUOSITUS",

    // Työvälineet
    workEquipmentBy: "Työ suoritetaan",
    tyovalineetLegend: "Työvälineet",
    tyovalineetToimittaja: "Freelancerin läppärillä",
    tyovalineetTilaaja: "Tilaajan läppärillä",

    // Location details
    travelWithin: "Matkakorvaus",
    notCharged: "poislukien matkustaminen",
    disputesResolvedAt: "Mahdolliset riidat ratkaistaan",
    travelNotChargedPrefix: "Missä tapahtuvasta matkustamisesta ei veloiteta",
    disputeResolutionPrefix: "Missä ratkaistaan mahdolliset riidat",
    travelTimeCompensation: "Matka-ajan korvaus",
    travelTimeCompensationRate: "€/tunti + ALV",
    travelTimeCompensationText: "Matka-ajan tuntikorvaus on {0} €/tunti + ALV.",

    // Location
    remote: "Etätyö (enimmäkseen etänä)",
    onsite: "Lähityö (enimmäkseen läsnä tilaajan toimistolla)",

    // Working hours
    flexibleHours: "Freelancer saa päättää itse mihin kellonaikoihin tekee töitä",
    clientHours: "Työ suoritetaan tilaajan normaalien työaikojen puitteissa",

    // Referenssioikeus
    legendReferenceRights: "Referenssioikeus",
    radioLabelReferenceRightsWide: "Laaja referenssioikeus (mitä, kenelle)",
    radioLabelReferenceRightsNarrow: "Suppea referenssioikeus (kenelle)",
    radioLabelReferenceRightsNo: "Ei referenssioikeutta",
    wideReferenceRights: "Laaja referenssioikeus",
    narrowReferenceRights: "Suppea referenssioikeus",
    noReferenceRights: "Ei referenssioikeutta",

    // Other terms
    dueDateDays: "Maksuaika",
    ofDaysToPay: "päivän maksuaika",
    travelHourCompensationShort: "Matkakorvaus",
    travelHourCompensation: "korvaus matkustamisesta,",
    excludingTravel: "poislukien matkustaminen",
    overtimeCompensation: "Ylityökorvaus",
    nonSolicitationShort: "Houkuttelukielto",
    nonSolicitation: "Houkuttelukielto",
    paymentTermsClause: "Laskujen maksuaika",
    freeText: "Vapaa teksti",
    prefixToFreeText: "Osapuolet ovat lisäksi ja/tai edellä sovitusta poiketen sopineet seuraavaa...",
    percentageIncrease: "Prosentuaalinen lisä",
    fixedRate: "Kiinteä tuntihinta",
    percentageExtra: "% ylimääräinen korvaus normaalista tuntiveloituksesta",
    overtimeRate: "€/tunti + ALV ylityökorvauksena",
    optionalSectionsInfo: "Olemme esitäyttäneet tämän osion valinnoilla, joita suosittelemme aiemmin antamiesi tietojen pohjalta.",
    fillSelectedSections: "Täytä valitut osiot",
    selectCompensationType: "Valitse korvaustyyppi alla",
    fillPercentage: "Täytä prosentti",
    fillHourlyRate: "Täytä tuntihinta",
    fillTextBelow: "Täytä teksti alla",
    enterPercentageHelp: "Syötä prosenttiluku, esim. 50",
    enterHourlyRateHelp: "Syötä tuntihinta, esim. 120",
    fillFieldOrUncheck: "Täytä tämä kenttä tai poista ruksi ylhäältä",
    paymentTermsShort: "Maksuaika",
    somethingInTextAreaShort: "Lisäehtoja vapaatekstikentässä",
    selected: "Valittu",
    edit: "Muokkaa",
    complete: "Valmis",
  },
  en: {
    choose: 'Choose',

    // Hero section
    title: "Software Freelancers Contract Template",
    subtitle: "Legally sound contract for direct assignment between freelancer and end client in Finland",
    startButton: "Draft a contract",

    benefit1: "Co-created with a law firm",
    benefit2: "Data processing locally on-device",
    benefit3: "100% free for everyone",

    // How it works section
    howItWorks: "How it works",
    step1Title: "Fill the form",
    step1Desc: "Our interactive form is designed to minimize your workload.",
    step2Title: "Download PDF",
    step2DescPart1: "Get the contract in PDF format immediately. The PDF might look like ",
    step2LinkText: "this",
    step3Title: "Sign",
    step3Desc: "Review the contract and sign together with the client.",
    importantNotice: "Important notice",
    disclaimer: "Ohjelmistofriikit is not responsible for the consequences of using the contract. You should always read your contract before signing it.",
    openSource: "The contract template is open source",
    googledocLink: "https://docs.google.com/document/d/1xfQ-sxhk4n_5Zr5eBm9NOEbIZQ6UsRTO4R-FeW-VhfA/edit?usp=sharing",

    // Form sections
    formStart: "Draft a contract",
    billingBasis: "Billing basis",
    contractParties: "Contract parties",
    clientInfo: "Client's information",
    supplierInfo: "Freelancer's information",
    contactPersons: "Contact persons",
    projectInfo: "Project Information",
    numberOfHours: "Hours",
    terminationPeriod: "Termination period",
    ipr: "Intellectual Property Rights (IPR)",
    location: "Location",
    workingHours: "Allowed working hours",
    legendKarajaoikeus: "Dispute resolution",
    otherTerms: "Other terms",

    prefixKarajaoikeus: "Disputes will be resolved at",

    // Billing options
    hourlyBilling: "Hourly billing",
    projectBilling: "Project billing",
    hourlyRate: "Hourly rate",
    projectPrice: "Project price",
    paymentTerms: "Payment terms",
    days: "days",
    hourlyRateLabel: "€/hour",
    projectRateLabel: "€",
    vat: "VAT",

    // Continue buttons
    continueToClientInfo: "Continue to client's information →",
    continueToSupplierInfo: "Continue to freelancer's information →",
    continueToProject: "Continue to project's information →",
    continueToHours: "Continue to hours →",
    continueToIPR: "Continue to Intellectual Property Rights →",
    continueToLocation: "Continue to location →",
    continueToWorkHours: "Continue to working hours →",
    continueToWorkEquipment: "Continue to work equipment →",
    continueToReferenceRights: "Continue to reference rights →",
    continueToKarajaoikeus: "Continue to dispute resolution →",
    continueToMuut: "Continue to other terms →",
    continueToGenerate: "🖊️ Generate PDF 🖊️",
    continue: "Continue →",

    // Final button
    createContract: "Create Contract",

    // Progress
    progress: "Progress",
    complete: "complete",

    // Form labels
    client: "The client",
    supplier: "The freelancer",
    clientCompany: "The client",
    clientBusinessId: "Business ID",
    supplierCompany: "Freelancer's company name",
    supplierBusinessId: "Business ID",
    clientContact: "Client contact person",
    supplierContact: "Freelancer's name",
    consultantRole: "Freelancer's role",
    buttonTextDownloadPDF: "Download PDF",
    clientEmail: "Email",
    clientPhone: "Phone",
    supplierEmail: "Email",
    supplierPhone: "Phone",
    freelancer: "Freelancer",

    // Validation messages
    emailRequired: "Email is required",
    emailInvalid: "Invalid email address",
    phoneRequired: "Phone number is required",
    phoneInvalid: "Invalid phone number",
    ytunnusRequired: "Business ID is required",
    ytunnusInvalid: "Invalid business ID",

    // Hours section
    agreedAllocation: "Agreed allocation",
    zeroHourContract: "Zero-hour contract",
    hoursPerWeek: "hours per week on average",
    startDate: "date when work begins",
    indefinite: "Contract remains in force indefinitely",
    fixedTerm: "Contract expires after a certain time",
    endDate: "date until which the contract is in force",
    averageHours: "On average",
    hours: "hours",
    perWeek: "per week",
    startingFrom: "starting from",
    endingOn: "ending on",
    indefinitelyValid: "in force indefinitely",
    zeroHourContractLabel: "Zero-hour contract,",
    validUntil: "in force until",
    until: "until",

    placeholderProjectName: "e.g. Webstore development, or Mobile app design",
    inAdditionToHourlyRate: "€/h on top of hourly rate",
    inAdditionToFixedPrice: "€/h on top of fixed price",
    placeholderInputWeeklyHours: "e.g. 37.5",
    placeholderInputTravelArea: "Helsinki metropolitan area",
    placeholderInputDistrictCourt: "District Court of Helsinki",

    placeholderInputClientCompany: "Winston Wood Oy",
    placeholderInputClientContactPerson: "Willy Winston",
    placeholderInputClientEmail: "winston@winstonwood.fi",
    placeholderInputFreelancerCompany: "Clean Code oy",
    placeholderInputFreelancerContactPerson: "Cecilia Hansen",
    placeholderInputFreelancerEmail: "cecilia@cleancode.fi",

    // Termination
    terminationPeriod: "Termination period",
    terminationWeeks: "week termination period",
    weeks: "weeks",

    // IPR
    iprGoesTo: "Intellectual property rights go to",
    supplierKeepsIPR: "the freelancer",
    clientKeepsIPR: "the client",
    radioClientKeepsIPR: "The client owns IPR",
    radioSupplierKeepsIPR: "The freelancer owns IPR",

    // Project Info
    prefixProject: "Freelancer consults",
    inProject: "in project:",
    inRole: "in the capacity of",
    projectName: "Project name or description",
    radioConsultantRoleSoftwareDeveloper: "Software Developer",
    radioConsultantRoleSoftwareDeveloperInflected: "as a software developer",
    radioConsultantRoleDesigner: "Designer",
    radioConsultantRoleDesignerInflected: "as a designer",
    radioConsultantRoleDevops: "DevOps",
    radioConsultantRoleDevopsInflected: "on DevOps",
    radioConsultantRoleScrumMaster: "Scrum Master",
    radioConsultantRoleScrumMasterInflected: "as a Scrum Master",
    radioConsultantRoleProjectManagement: "Project Management",
    radioConsultantRoleProjectManagementInflected: "on project management",
    radioConsultantRoleOther: "Other",
    radioConsultantRoleOtherInflected: "in undetermined role",

    // Työvälineet
    workEquipmentBy: "Work is performed using",
    tyovalineetLegend: "Work Equipment",
    tyovalineetToimittaja: "Freelancer uses their own laptop",
    tyovalineetTilaaja: "Client provides a laptop for the freelancer",

    // Location
    workRemotelyPart1: "Work performed mostly",
    workRemotelyPart2: "remotely",
    workOnsitePart1: "Work performed mostly",
    workOnsitePart2: "on-site",

    // Working Hours
    flexibleWorkingHoursPart1: "The freelancer's",
    flexibleWorkingHoursPart2: "working hours are not restricted",
    flexibleWorkingHoursLabel: "Any hours: the freelancer can decide when to work",
    clientWorkingHoursPart1: "The work will be performed during",
    clientWorkingHoursPart2: "the client's normal working hours",
    clientWorkingHoursPart3: " ",
    clientWorkingHoursLabel: "Restricted hours: client's normal working hours",

    // Summary labels
    project: "Project",

    // Badge
    recommended: "RECOMMENDED",

    // Location details
    travelWithin: "Travel compensation",
    notCharged: "except for travel within",
    disputesResolvedAt: "Possible disputes resolved at",
    travelNotChargedPrefix: "Which area is excluded from travel compensation",
    disputeResolutionPrefix: "Where will disputes be resolved",
    travelTimeCompensationText: "Travel time compensation is {0} €/hour + VAT.",
    travelTimeCompensation: "Travel time compensation",
    travelTimeCompensationRate: "€/hour + VAT",

    // Location
    remote: "Remote work (mostly remote)",
    onsite: "On-site work (mostly at the client's office)",

    // Working hours
    flexibleHours: "Freelancer can decide their own working hours",
    clientHours: "Work is performed within client's normal working hours",

    // Reference rights
    legendReferenceRights: "Reference rights",
    radioLabelReferenceRightsWide: "Wide reference rights (client name and project description)",
    radioLabelReferenceRightsNarrow: "Narrow reference rights (client name)",
    radioLabelReferenceRightsNo: "No reference rights",
    wideReferenceRights: "Wide reference rights",
    narrowReferenceRights: "Narrow reference rights",
    noReferenceRights: "No reference rights",

    // Other terms
    dueDateDays: "Payment term",
    ofDaysToPay: "day payment term",
    travelHourCompensationShort: "Travel time compensation",
    travelHourCompensation: "compensation for travel,",
    excludingTravel: "except for travel within",
    overtimeCompensation: "Overtime compensation",
    nonSolicitation: "Non-solicitation clause",
    paymentTermsClause: "Invoice payment period",
    freeText: "Free text",
    prefixToFreeText: "The parties have in addition and/or contrary to above, agreed upon the following...",
    percentageIncrease: "Percentage increase",
    fixedRate: "Fixed hourly rate",
    percentageExtra: "% extra compensation from normal hourly billing",
    overtimeRate: "€/hour + VAT as overtime compensation",
    optionalSectionsInfo: "We have prefilled this section based on your earlier inputs.",
    fillSelectedSections: "Fill selected sections",
    selectCompensationType: "Select compensation type below",
    fillPercentage: "Fill percentage",
    fillHourlyRate: "Fill hourly rate",
    fillTextBelow: "Fill text below",
    enterPercentageHelp: "Enter percentage number, e.g. 50",
    enterHourlyRateHelp: "Enter hourly rate, e.g. 120",
    fillFieldOrUncheck: "Fill this field or uncheck the box above",
    nonSolicitationShort: "Non-solicitation clause",
    paymentTermsShort: "Payment terms",
    somethingInTextAreaShort: "Additional terms in free text area",
    selected: "Selected",
    edit: "Edit",
    complete: "Complete",
  }
};