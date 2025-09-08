const FONT_NAME = 'PlusJakartaSans';
const FONT_SIZE_DOCUMENT_TITLE = 24;
const FONT_SIZE_SECTION_TITLE = 10;
const FONT_SIZE_PARAGRAPH = 10;
const FONT_STYLE_DOCUMENT_TITLE = 'normal';
const FONT_STYLE_SECTION_TITLE = 'bold';
const FONT_STYLE_PARAGRAPH = 'normal';

const MARGIN_TOP = 20;
const MARGIN_X = 20;

function getPDF(state) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const PAGE_WIDTH = doc.internal.pageSize.width;
  const PAGE_HEIGHT = doc.internal.pageSize.height;
  const MAX_LINE_WIDTH = PAGE_WIDTH - 2 * MARGIN_X;

  // State (as we fill out the document, we will update these)
  let yPos = MARGIN_TOP;
  let sectionNum = 1;

  // Helper that adds new page when we are close to the bottom of the page
  const addNewPageIfNeeded = () => {
    if (yPos > 270) {
      doc.addPage();
      yPos = MARGIN_TOP;
    }
  };

  // Helper that adds a section title and some whitespace before and after it
  const addSectionTitle = (fi, en) => {
    const titleText = `${sectionNum++}. ${state.currentLanguage === 'fi' ? fi : en}`;
    doc.setFontSize(FONT_SIZE_SECTION_TITLE);
    doc.setFont(FONT_NAME, FONT_STYLE_SECTION_TITLE);
    yPos += 1;
    // Section titles should be only 1 line, but just in case, split text into lines that fit within the max line width
    const lines = doc.splitTextToSize(titleText, MAX_LINE_WIDTH);
    for (let line of lines) {
      doc.text(line, MARGIN_X, yPos);
      yPos += 11;
      addNewPageIfNeeded();
    }
  }

  // Helper that adds paragraph and some whitespace after it
  const addParagraph = (fi, en) => {
    const paragraphText = state.currentLanguage === 'fi' ? fi : en;
    doc.setFontSize(FONT_SIZE_PARAGRAPH);
    doc.setFont(FONT_NAME, FONT_STYLE_PARAGRAPH);
    // Split text into lines that fit within the max line width
    const lines = doc.splitTextToSize(paragraphText, MAX_LINE_WIDTH);
    for (let line of lines) {
      doc.text(line, MARGIN_X, yPos);
      yPos += 6;
      addNewPageIfNeeded();
    }
    yPos += 4;
  };

  // Helper that will crash and show error message instead of generating invalid contracts
  const unexpectedError = () => {
    const errorMsg = state.currentLanguage === 'fi' ?
      `Sisäinen virhe sopimusta luodessa (kohta ${sectionNum}). Pyytäisimme että raportoit virheestä.` :
      `An internal error occurred while generating the contract (section ${sectionNum}). We kindly request that you report this issue to us.`;
    alert(errorMsg);
    throw new Error(errorMsg);
  }

  // Document title
  const documentTitleText = state.currentLanguage === 'fi' ?
    "Konsultointisopimus" :
    "Consulting Agreement";
  doc.setFontSize(FONT_SIZE_DOCUMENT_TITLE);
  doc.setFont(FONT_NAME, FONT_STYLE_DOCUMENT_TITLE);
  yPos += 12;
  doc.text(documentTitleText, PAGE_WIDTH / 2, yPos, { align: 'center' });
  yPos += 24;

  // 1. Sopimuksen osapuolet
  addSectionTitle(
    "Sopimuksen osapuolet",
    "Parties to the Agreement"
  );
  addParagraph(
    `${state.tilaajanYritysValmis} (${state.tilaajanYtunnusValmis}) (jäljempänä "Tilaaja")`,
    `${state.tilaajanYritysValmis} (${state.tilaajanYtunnusValmis}) (hereinafter "the Client")`
  );
  addParagraph(
    `${state.toimittajanYritysValmis} (${state.toimittajanYtunnusValmis}) (jäljempänä "Toimittaja")`,
    `${state.toimittajanYritysValmis} (${state.toimittajanYtunnusValmis}) (hereinafter "the Supplier")`
  );

  // 2. Yhteyshenkilöt
  addSectionTitle(
    "Yhteyshenkilöt",
    "Contact Persons"
  );
  addParagraph(
    `Tilaajan puolelta: ${state.tilaajanYhteyshenkiloValmis} (${state.tilaajanPuhelinValmis}, ${state.tilaajanEmailValmis})`,
    `The Client's contact person: ${state.tilaajanYhteyshenkiloValmis} (${state.tilaajanPuhelinValmis}, ${state.tilaajanEmailValmis})`
  );
  addParagraph(
    `Toimittajan puolelta: ${state.toimittajanYhteyshenkiloValmis} (${state.toimittajanPuhelinValmis}, ${state.toimittajanEmailValmis})`,
    `The Supplier's contact person: ${state.toimittajanYhteyshenkiloValmis} (${state.toimittajanPuhelinValmis}, ${state.toimittajanEmailValmis})`
  );

  // 3. Sopimuksen kohde ja tarkoitus
  addSectionTitle(
    "Sopimuksen kohde ja tarkoitus",
    "Scope and Purpose of the Agreement"
  );
  if (state.radioLaskutusmuoto === 'tuntilaskutus') {
    addParagraph(
      "Tilaaja ostaa Toimittajalta konsultointia Tilaajan projektiin.",
      "The Client purchases consulting services from the Supplier for the Client's project."
    );
    addParagraph(
      `Projekti: ${state.projektinNimiValmis}`,
      `The Project: ${state.projektinNimiValmis}`
    );
    addParagraph(
      `Konsultin rooli: ${state.getConsultantRoleText()}`,
      `Consultant's role: ${state.getConsultantRoleText()}`
    );
    addParagraph(
      "Tilaaja osoittaa Toimittajalle konsultointitehtäviä sopimuksen kohteen puitteissa.",
      "The Client assigns consulting tasks to the Supplier within the scope of the Project."
    );
  } else if (state.radioLaskutusmuoto === 'urakkalaskutus') {
    addParagraph(
      "Tilaaja ostaa Toimittajalta urakkaperusteisen konsultoinnin.",
      "The Client purchases fixed-price consulting services from the Supplier."
    );
    addParagraph(
      `Urakka: ${state.projektinNimiValmis}`,
      `Deliverables: ${state.projektinNimiValmis}`
    );
  } else {
    unexpectedError();
  }

  // 4. Laskutus
  if (state.radioLaskutusmuoto === 'tuntilaskutus' && state.radioAllokaatio === 'nollatuntisopimus') {
    addSectionTitle(
      "Tuntiperusteinen laskutus",
      "Time and Material Billing"
    );
    addParagraph(
      `Tilaaja maksaa konsultoinnista ${state.tuntihintaValmis} €/tunti + ALV.`,
      `The Client shall pay ${state.tuntihintaValmis} €/hour + VAT for consulting services.`
    );
    addParagraph(
      "Laskutus koostuu toteutuneen konsultoinnin tuntiveloituksesta ja mahdollisista kuluista, kuten esimerkiksi matkakuluista. Toimittaja lähettää Tilaajalle laskun kerran kuukaudessa jälkikäteen tavalla, jonka Tilaaja ilmoittaa Toimittajalle kirjallisesti. Mikäli Tilaaja ei ilmoita laskutusyhteystietojaan, Toimittaja voi lähettää laskun Tilaajalle kohtuulliseksi katsomallaan tavalla.",
      "The Supplier shall invoice all services and expenses on a time and material basis monthly in arrears, including e.g. travel costs. The Client shall instruct the Supplier in writing regarding how the invoices shall be sent. Should the Client not provide such instructions, the Supplier may send invoices to the Client in any reasonable manner deemed appropriate by the Supplier."
    );
    addParagraph(
      "Laskujen yhteydessä lähetetään erittely konsultointiin käytetyistä tunneista.",
      "An itemization of billed hours will be included with each invoice."
    );
    addParagraph(
      "Toimittajalla on oikeus muuttaa konsultoinnin hintaa kohtuullisesti kerran vuodessa ilmoittamalla muutoksesta asiakkaalle kirjallisesti vähintään kuukausi ennen muutoksen voimaantulopäivää. Ensimmäinen hinnanmuutos voi tulla voimaan aikaisintaan 12 kuukauden kuluttua siitä, kun tämä sopimus tuli voimaan.",
      "The Supplier has the right to change the price reasonably once per year by notifying the Client in writing at least one month before the effective date of the change. The first price change may take effect no earlier than 12 months after the effective date of this Agreement."
    );
  } else if (state.radioLaskutusmuoto === 'tuntilaskutus' && state.radioAllokaatio === 'sovittu-allokaatio') {
    addSectionTitle(
      "Tunti- ja allokaatioperusteinen laskutus",
      "Time and Material Billing with Allocation"
    );
    addParagraph(
      `Tilaaja maksaa konsultoinnista ${state.tuntihintaValmis} €/tunti + ALV.`,
      `The Client pays ${state.tuntihintaValmis} €/hour + VAT for consulting services.`
    );
    addParagraph(
      `Sopimuksen ollessa voimassa konsultointi perustuu sovitun allokaatiomäärän mukaiseen konsultointiin, joka sopimuksen alkaessa on keskimäärin ${state.tuntejaViikossaValmis} tuntia viikossa laskutuskausittain. Tilaajalla on oikeus alentaa allokaatiota ilmoittamalla tästä Toimittajalle ${state.irtisanomisaikaViikoissaValmis} viikkoa etukäteen.`,
      `During the term of the Agreement, consulting is based on an agreed allocation, which at the commencement of the Agreement is on average ${state.tuntejaViikossaValmis} hours per week. The Client has the right to reduce the allocation by providing the Supplier with ${state.irtisanomisaikaViikoissaValmis} weeks' notice in advance.`
    );
    addParagraph(
      "Mikäli Tilaajan Toimittajalle toimeksi antamat tehtävät eivät laskutuskaudella täytä sovittua allokaatiomäärää, Tilaaja on velvollinen maksamaan – ja Toimittaja oikeutettu laskuttamaan – toteutuneen konsultoinnin lisäksi allokaatiohyvityksenä summan, joka vastaa suuruudeltaan 30% siitä erotuksesta, jonka Toimittaja olisi saanut konsultoimalla Tilaajaa sovitun allokaation mukaisesti. Mikäli Toimittajan konsultti ei konsultoi Tilaajaa sovitun allokaation mukaisesti Toimittajasta johtuvista syistä, Toimittaja on oikeutettu laskuttamaan vain toteutuneen konsultoinnin.",
      "If the tasks assigned by the Client to the Supplier do not meet the agreed allocation during a billing period, and the Client does not provide additional tasks for the Supplier, then the Client shall pay – and the Supplier is entitled to invoice – an allocation credit. The allocation credit amounts to 30% of the unfulfilled allocation (the difference between realized hours and the agreed allocation). Should the Supplier not meet the allocation due to reasons attributable to the Supplier, the Supplier is entitled to invoice only the actual hours."
    );
    addParagraph(
      "Laskutus koostuu allokaation ja toteutuneen konsultoinnin yhdistelmästä edellä kuvatusti ja mahdollisista muista kuluista, kuten esimerkiksi matkakuluista. Toimittaja lähettää Tilaajalle laskun kerran kuukaudessa jälkikäteen tavalla, jonka Tilaaja ilmoittaa Toimittajalle kirjallisesti. Mikäli Tilaaja ei ilmoita laskutusyhteystietojaan, Toimittaja voi lähettää laskun Tilaajalle kohtuulliseksi katsomallaan tavalla.",
      "Billing consists of a combination of allocation credits and consulting hours as described above and possible additional expenses, such as travel costs. The Supplier will send the invoice to the Client monthly in arrears. The Client shall instruct the Supplier in writing regarding how the invoices shall be sent. Should the Client not provide such instructions, the Supplier may send invoices to the Client in any reasonable manner deemed appropriate by the Supplier."
    );
    addParagraph(
      "Laskujen yhteydessä lähetetään erittely konsultointiin käytetyistä tunneista.",
      "An itemization of billed hours will be included with each invoice."
    );
    addParagraph(
      "Toimittajalla on oikeus muuttaa konsultoinnin hintaa kohtuullisesti kerran vuodessa ilmoittamalla muutoksesta asiakkaalle kirjallisesti vähintään kuukausi ennen muutoksen voimaantulopäivää. Ensimmäinen hinnanmuutos voi tulla voimaan aikaisintaan 12 kuukauden kuluttua siitä, kun tämä sopimus tuli voimaan.",
      "The Supplier has the right to change price reasonably once per year by notifying the Client in writing at least one month before the effective date of the change. The first price change may take effect no earlier than 12 months after the effective date of this Agreement."
    );
  } else if (state.radioLaskutusmuoto === 'urakkalaskutus') {
    addSectionTitle(
      "Urakkaperusteinen laskutus",
      "Fixed-Price Billing"
    );
    addParagraph(
      `Tilaaja maksaa konsultoinnista ${state.urakkahintaValmis} € + ALV.`,
      `The Client shall pay ${state.urakkahintaValmis} € + VAT for consulting services.`
    );
    addParagraph(
      "Laskut lähetetään tavalla, jonka Tilaaja ilmoittaa Toimittajalle kirjallisesti. Mikäli Tilaaja ei ilmoita laskutusyhteystietojaan, Toimittaja voi lähettää laskun Tilaajalle kohtuulliseksi katsomallaan tavalla. Mikäli tässä sopimuksessa tai sen liitteissä ei ole määritetty tarkemmin laskujen lähetysajankohtia, Toimittaja lähettää Tilaajalle laskun vasta, kun urakka on toimitettu.",
      "The Client shall instruct the Supplier in writing regarding how the invoices shall be sent. Should the Supplier not meet the allocation due to reasons attributable to the Supplier, the Supplier is entitled to invoice only the actual hours. Unless is otherwise agreed in writing, the Supplier shall send the invoice after the project is delivered."
    );
    addParagraph(
      `Urakka katsotaan toimitetuksi, jos Tilaaja ei esitä Toimittajalle perusteltua kirjallista huomautusta ${state.maksuaikaValmis} päivän kuluessa urakan tulosten vastaanottamisesta.`,
      `The deliverables provided by the Supplier are considered to be accepted by the Client if the Client does not present the Supplier with a specified written complaint within ${state.maksuaikaValmis} days of receiving the deliverables.`
    );
    addParagraph(
      "Urakkaan kuuluva kokonaisuus on määritelty tarkemmin liitteessä.",
      "The scope included in the project is defined in more detail in the Appendix.",
    )
  } else {
    unexpectedError();
  }

  // 5. Voimassaolo
  addSectionTitle(
    "Voimassaolo",
    "Validity"
  );
  if (state.radioLaskutusmuoto === 'tuntilaskutus' && state.radioAllokaatio === 'nollatuntisopimus') {
    addParagraph(
      `Sopimus tulee voimaan kun se on allekirjoitettu ja on voimassa ${state.radioVoimassaolo === 'toistaiseksi' ? 'toistaiseksi' : state.loppupaivamaaraValmis + ' saakka'}.`,
      `The Agreement becomes effective upon signing and is valid until ${state.radioVoimassaolo === 'toistaiseksi' ? 'further notice' : state.loppupaivamaaraValmis}.`
    );
    addParagraph(
      "Kumpi tahansa osapuoli voi irtisanoa sopimuksen ilman irtisanomisaikaa.",
      "Either party may terminate the Agreement to end without a notice period."
    );
  } else if (state.radioLaskutusmuoto === 'tuntilaskutus' && state.radioAllokaatio === 'sovittu-allokaatio') {
      addParagraph(
        `Sopimus tulee voimaan ${state.alkupaivamaaraValmis} ja on voimassa ${state.radioVoimassaolo === 'toistaiseksi' ? 'toistaiseksi' : state.loppupaivamaaraValmis + ' saakka'}.`,
        `The Agreement becomes effective on ${state.alkupaivamaaraValmis} and is valid until ${state.radioVoimassaolo === 'toistaiseksi' ? 'further notice' : state.loppupaivamaaraValmis}.`,
      );
      addParagraph(
        `Kumpi tahansa osapuoli voi irtisanoa sopimuksen ${state.irtisanomisaikaViikoissaValmis} viikon irtisanomisajalla.`,
        `Either party may terminate the Agreement to end with ${state.irtisanomisaikaViikoissaValmis} weeks' notice.`,
      );
      addParagraph(
        "Mikäli Tilaaja ei maksa laskua kokonaisuudessaan sovitun maksuajan mukaisesti, Toimittaja voi lähettää kirjallisen maksumuistutuksen. Mikäli Tilaaja ei maksa laskua 14 päivän kuluessa maksumuistutuksen lähettämisestä, Toimittajalla on oikeus halutessaan keskeyttää tai purkaa sopimus päättymään välittömästi yksipuolisella ilmoituksella. Tässä tilanteessa Tilaaja on velvollinen maksamaan myös normaalia irtisanomisaikaa vastaavan allokaatiohyvityksen.",
        "If the Client does not pay an invoice in full within the agreed payment term, the Supplier may send a written payment reminder. If the Client does not pay the invoice within 14 days of sending the payment reminder, the Supplier may at Supplier’s discretion suspend or terminate the Agreement with immediate effect by unilateral notice. In such event, the Client is obligated to also pay the allocation credit corresponding to the normal notice period."
      );
  } else if (state.radioLaskutusmuoto === 'urakkalaskutus') {
    addParagraph(
      "Sopimus päättyy urakan tultua tehdyiksi.",
      "The Agreement ends upon completion of the Project."
    );
  } else {
    unexpectedError();
  }

  // 6. Konsultti
  addSectionTitle(
    "Konsultti",
    "Consultant"
  );
  addParagraph(
    `Konsultoinnin suorittaa ${state.toimittajanYhteyshenkiloValmis} (jäljempänä \"Konsultti\")`,
    `${state.toimittajanYhteyshenkiloValmis} (hereinafter "The Consultant") will perform the consulting services.`
  );
  addParagraph(
    "Toimittaja ei saa vaihtaa Konsulttia toiseen henkilöön ilman Tilaajan kirjallista suostumusta. Mikäli Konsultti on sairauden tai muun Toimittajasta riippumattoman syyn takia estynyt suorittamasta konsultointia, Toimittaja ilmoittaa tästä Tilaajalle ilman aiheetonta viivytystä ja konsultointi keskeytyy tällaiseksi ajaksi ilman vastuuseuraamuksia kummallekaan osapuolelle, elleivät osapuolet sovi korvaavasta järjestelystä.",
    "The Supplier may not change the Consultant to another person without the Client's written consent. If the Consultant is unavailable due to illness or other reasons independent of the Supplier, the Supplier will notify the Client without undue delay, and consulting is suspended for such time without consequences for either party, unless the parties agree on alternative arrangements."
  );

  // 7. Alihankinta
  addSectionTitle(
    "Alihankinta",
    "Subcontracting"
  );
  addParagraph(
    "Toimittaja ei saa käyttää alihankintaa ilman Tilaajan kirjallista suostumusta.",
    "The Supplier may not use subcontractors without the Client's written approval."
  );

  // 8. Konsultointi ei muodosta työsuhdetta Tilaajaan
  addSectionTitle(
    "Konsultointi ei muodosta työsuhdetta Tilaajaan",
    "Independent Contractor"
  );
  addParagraph(
    "Tilaaja ei ole Konsultin työnantaja. Konsultti ei ole työsuhteessa Tilaajaan. Tämä sopimus tai siihen liittyvä konsultointi ei muodosta työsuhdetta Tilaajan ja Konsultin välille, eikä tämä sopimus rajoita Toimittajaa tekemästä muita sopimuksia muiden yritysten kanssa.",
    "The Client is not the Consultant's employer. The Consultant is not an employee of the Client. This Agreement or consulting services thereof will not create  employment relationship between the Client and the Consultant. This Agreement does not restrict the Supplier from making other agreements with other clients and companies."
  );

  // 9. Maksuaika
  addSectionTitle(
    "Maksuaika",
    "Payment Terms"
  );
  addParagraph(
    `Laskujen maksuaika on ${state.maksuaikaValmis} päivää netto laskun päiväyksestä. Viivästyskorko on korkolain mukainen.`,
    `Invoices must be paid within ${state.maksuaikaValmis} days net from the invoice date. Interest on delayed payments accrues in accordance with the Finnish Interest Act (korkolaki).`
  );

  // 10. Konsultoinnin suorittaminen
  addSectionTitle(
    "Konsultoinnin suorittaminen",
    "Provision of Services"
  );
  if (state.radioSijainti === 'etana' && state.radioTyoajat === 'milloinTahansa') {
    addParagraph(
      "Konsultointi suoritetaan pääsääntöisesti etänä. Konsultti päättää itse omista työajoistaan. Toimittaja vastaa työtilansa ja tavanomaisten työvälineiden järjestämisestä.",
      "The consulting services are provided primarily remotely. The Consultant decides independently  the working hours. The Supplier shall equip its’ Consultants with the necessary working space  and ordinary work tools and equipment for carrying out the assigned tasks."
    );
  } else if (state.radioSijainti === 'etana' && state.radioTyoajat !== 'milloinTahansa') {
    addParagraph(
      "Konsultointi suoritetaan pääsääntöisesti etänä Tilaajan normaalien työaikojen puitteissa. Toimittaja vastaa työtilansa ja tavanomaisten työvälineiden järjestämisestä.",
      "The consulting services are provided primarily remotely within the Client’s normal working hours. The Supplier shall equip its’ Consultants with the necessary working space and ordinary work tools and equipment for carrying out the assigned tasks."
    )
  } else if (state.radioSijainti === 'lasna' && state.radioTyovalineet === 'toimittajanTyovalineet') {
    addParagraph(
      "Konsultointi suoritetaan pääsääntöisesti Tilaajan tiloissa Tilaajan normaalien työaikojen puitteissa. Tilaaja vastaa työtilan järjestämisestä. Toimittaja vastaa tavanomaisten työvälineiden järjestämisestä.",
      "The consulting services are provided primarily at the Client’s premises within the Client’s normal working hours. The Client is responsible for providing a suitable workspace. The Supplier is responsible for ordinary work equipment."
    );
  } else if (state.radioSijainti === 'lasna' && state.radioTyovalineet === 'tilaajanTyovalineet') {
    addParagraph(
      "Konsultointi suoritetaan pääsääntöisesti Tilaajan tiloissa Tilaajan normaalien työaikojen puitteissa. Tilaaja vastaa työtilan järjestämisestä. Tilaaja vastaa tavanomaisten työvälineiden järjestämisestä.",
      "The consulting services are provided primarily at the Client’s premises within the Client’s normal working hours. The Client is responsible for providing a suitable workspace. The Client is responsible for ordinary work equipment."
    )
  } else {
    unexpectedError();
  }

  // 11. Tilaajan ohjelmistot ja työvälineet
  addSectionTitle(
    "Tilaajan ohjelmistot ja työvälineet",
    "The Client's Software and Tools"
  );
  addParagraph(
    "Tilaaja vastaa siitä, että Tilaaja järjestää ja luovuttaa kustannuksellaan Toimittajalle konsultoinnin suorittamista varten riittävät oikeudet käyttää ja hyödyntää Tilaajan käyttämiä tai edellyttämiä järjestelmiä, pilvipalveluita, ohjelmistoja ja muita tarvittavia palveluita tai tavanomaisesta poikkeavia työvälineitä.",
    "The Client shall arrange and provide for the Supplier, at the Client’s cost, necessary rights to use and access any and all systems, cloud services, software, and other services as well as other than ordinary tools and equipment that may be used by the Client and/or otherwise required to carry out the Services."
  );

  // 12. Korvaus poikkeavasta työajasta [OPTIONAL]
  if (state.checkboxYlityokorvaus && state.ylityokorvausValmis) {
    addSectionTitle(
      "Korvaus poikkeavasta työajasta",
      "Compensation for Extraordinary Hours"
    );
    addParagraph(
      `Mikäli Tilaaja erikseen pyytää Konsulttia tekemään konsultointia normaalien työaikojen ulkopuolella, näistä työtunneista veloitetaan normaalin veloituksen lisäksi ylimääräinen korvaus ${state.ylityokorvausValmis} €/tunti + ALV. Tässä yhteydessä normaalina työaikana tarkoitetaan 7.5 tuntia arkipäivänä, joka sijoittuu ajallisesti 08.00-18.00 aikavälille eikä kohdistu viikonlopulle, pyhäpäivälle tai ennalta sovitulle loma-ajankohdalle.`,
      `If the Client specifically requests the Consultant to perform consulting outside normal working hours, these hours will be billed with an additional fee of ${state.ylityokorvausValmis} €/hour + VAT on top of normal hourly fee. Normal working hours in this context mean 7.5 hours on weekdays, occurring between 08:00-18:00. Weekends, holidays, and pre-agreed vacation periods are outside normal working hours.`
    );
    addParagraph(
      "Selvyyden vuoksi todetaan, että pyyntö ylitöiden tekemiseen katsotaan pyynnöksi poiketa normaalista työajasta, vaikka Tilaaja ei erikseen määrittelisi minä ajanhetkenä ylityöt tulee tehdä.",
      "For clarity, a request to work overtime constitutes extraordinary working hours even if the Client does not specify the exact hours during which overtime work should be performed."
    );
  }

  // 13. Matkakorvaukset
  addSectionTitle(
    "Matkakorvaukset",
    "Travel Compensation"
  );
  addParagraph(
    `${state.matkustusalueValmis.charAt(0).toUpperCase() + state.matkustusalueValmis.slice(1)} tapahtuvasta matkustamisesta ei veloiteta Tilaajaa millään tavalla.`,
    `Travel within ${state.matkustusalueValmis} will not be charged for in any way.`
  );
  addParagraph(
    `Mikäli Tilaaja edellyttää matkustamista edellä mainitun alueen ulkopuolelle, Toimittajalla on oikeus veloittaa erikseen tavanomaiset ja kohtuulliset matka- päiväraha- ja majoituskulut, matka-ajan tuntikorvaus, sekä kilometrikorvaukset. Päiväraha ja kilometrikorvaus veloitetaan Verohallinnon kulloinkin voimassa olevien ohjeiden mukaisesti. Matka-ajan tuntikorvaus on ${state.matkakorvausValmis} €/tunti + alv. Muut kulut veloitetaan toteutuneiden kustannusten mukaisesti.`,
    `Should the Client require the Consultant to travel outside the aforementioned area, the Supplier has the right to charge separately for reasonable travel and accommodation costs, travel time hourly compensation, as well as per diem and kilometer allowances. Per diem and kilometer allowances are charged according to the then-current Tax Administration's current guidelines. Travel time hourly compensation is ${state.matkakorvausValmis} €/hour + VAT. Other costs are charged according to actual expenses.`
  );

  // 14. Aineettomat oikeudet
  addSectionTitle(
    "Aineettomat oikeudet",
    "Intellectual Property Rights"
  );
  if (state.radioIPR === 'tilaajalle') {
    addParagraph(
      "Kaikki konsultoinnissa luotujen toimitettujen tulosten luovutettavissa olevat tekijänoikeudet ja muut aineettomat oikeudet siirtyvät Tilaajalle laskun maksamisen yhteydessä. Mikäli laskuja/maksueriä on useita, aineettomat oikeudet siirtyvät laskuja/maksueriä vastaavissa osissa. Tilaajalla on oikeus muokata edellä tarkoitettuja tuloksia itse tai kolmannen osapuolen avustuksella sekä luovuttaa Toimittajan sille luovuttamat oikeudet edelleen rajoituksetta.",
      "All transferable copyrights and other intellectual property rights of deliverables resulting from consulting services shall transfer to the Client upon payment of the respective corresponding invoice(s). These rights of the Client shall include unlimited right to assign, transfer and modify – or have modified - such rights."
    );
    addParagraph(
      "Selvyyden vuoksi todetaan, että edellä sovittu ei koske Toimittajan Tilaajalle mahdollisesti toimittamia avoimen lähdekoodin ohjelmistoja, joita Toimittaja voi toimittaa konsultoinnin tulosten yhteydessä tai osana. Ellei toisin sovita, Tilaajalla on oikeus käyttää näitä Tilaajan omassa sisäisessä toiminnassa ja luovuttaa vastaavia käyttöoikeuksia Tilaajan konserniyhtiölle. Tilaajan omaksi sisäiseksi toiminnaksi ei katsota käyttöoikeuden myymistä tai muuta käytön luovutusta kolmansille osapuolille. Lisäksi, avoimen lähdekoodin ohjelmistoihin sovelletaan niiden ohjelmistokoodista ja -tiedostoista ilmeneviä käyttöoikeusehtoja, eikä tämä sopimus rajoita näistä ilmeneviä Tilaajan oikeuksia avoimen lähdekoodin ohjelmistoihin.",
      "For clarity, the above does not apply to open source software that the Supplier may deliver to the Client in connection with or as part of consulting services or deliverables thereof. Unless otherwise agreed, the Client has the right to use these for the Client's own internal operations and grant corresponding licenses to the Client's group companies. Transfer or sale of such licenses to third parties shall not be considered as the Client’s own internal operations. Furthermore, separate license terms that are specified in the applicable software documentation, readmes or notice files shall apply to such open source software. Cient’s rights to such open source software under such separate license terms are not restricted by the Agreement."
    );
  } else if (state.radioIPR === 'toimittajalle') {
    addParagraph(
      "Kaikki konsultoinnin tulosten aineettomat oikeudet, kuten tietokoneohjelmiston koodi ja sen tekijänoikeudet, kuuluvat Toimittajalle.",
      "All intellectual property rights of deliverables provided by the Supplier, such as computer software code and copyrights thereof, shall belong to the Supplier."
    );
    addParagraph(
      "Tilaajan aineisto, mukaan lukien data joka syntyy Tilaajan käyttäessä konsultoinnin tuloksia, kuuluu Tilaajan omistukseen.",
      "The Client's material, including data generated by the Client's use of deliverables, shall remain property of the Client."
    );
    addParagraph(
      "Tilaajalla on käyttöoikeus konsultoinnin tuloksiin sikäli kuin käytön voidaan katsoa olevan osa Tilaajan omaa sisäistä toimintaa. Käyttöoikeus sisältää oikeuden edelleen kehittää, muokata ja kopioida sekä luovuttaa vastaavia käyttöoikeuksia Tilaajan konserniyhtiölle. Selvyyden vuoksi sanottakoon, että Tilaajan omaksi sisäiseksi toiminnaksi ei katsota tulosten käyttöoikeuden myymistä tai muuta käytön luovutusta kolmansille osapuolille.",
      "The Client has the right to use these deliverables for the Client's internal operations. This right to use includes the right to further develop, modify, copy, and grant corresponding rights to use to the Client's group companies. For clarity, transferring these rights to third parties shall not be considered as the Client's internal operations."
    );
  } else {
    unexpectedError();
  }

  // 15. Henkilötietojen käsittely
  addSectionTitle(
    "Henkilötietojen käsittely",
    "Processing of Personal Data"
  );
  addParagraph(
    "Tilaaja voi saattaa henkilötietoja Toimittajan käsiteltäväksi Tilaajan lukuun vain, jos osapuolet sopivat siitä ja siihen liittyvistä ehdoista kirjallisesti etukäteen.",
    "The Client may provide Personal data to the Supplier for processing on the Client’s behalf only if the parties agree upon such processing and related terms in writing in advance."
  );

  // 16. Yksisuuntainen houkuttelukielto [OPTIONAL]
  if (state.checkboxHoukuttelukielto) {
    addSectionTitle(
      "Yksisuuntainen houkuttelukielto",
      "Non-Solicitation"
    );
    addParagraph(
      "Toimittaja ei saa houkutella Tilaajan henkilöitä palvelukseensa sopimuksen voimassaoloaikana.",
      "The Supplier may not solicit the Client's personnel into their service during the term of the Agreement."
    );
  }

  // 17. Salassapito
  addSectionTitle(
    "Salassapito",
    "Confidentiality"
  );
  addParagraph(
    "Osapuolet sitoutuvat pitämään salassa sopimuksen voimassaoloaikana ja kolme vuotta sen jälkeen toiselta osapuolelta tietoonsa saaman luottamukselliseksi merkityn tai kohtuudella sellaiseksi ymmärrettävän tiedon ja aineiston.",
    "The parties commit to keep confidential, during the term of the Agreement and for three years thereafter, any information and material received from the other party that is either marked as confidential or reasonably understood as such."
  );

  // 18. Reference Rights [OPTIONAL]
  if (state.radioReferenceRights === 'wideReferenceRights') {
    addSectionTitle(
      "Referenssioikeus",
      "Reference"
    );
    addParagraph(
      "Toimittajalla on oikeus mainita Tilaaja markkinoinnissa Toimittajan asiakkaana. Toimittaja saa käyttää julkisena referenssinä myös yleisluonteista kuvausta Tilaajalle toimitetusta konsultoinnista ja tuloksista. Referenssioikeus pysyy voimassa sopimuksen päätyttyä.",
      "The Supplier has the right to reference the Client in marketing as the Supplier’s customer. The Supplier may also use as public reference a general description of consulting services and deliverables provided to the Client. These rights survive the end of the Agreement."
    )
  } else if (state.radioReferenceRights === 'narrowReferenceRights') {
    addSectionTitle(
      "Referenssioikeus",
      "Reference"
    );
    addParagraph(
      "Toimittajalla on oikeus mainita Tilaaja markkinoinnissa Toimittajan asiakkaana. Referenssioikeus pysyy voimassa sopimuksen päätyttyä.",
      "The Supplier has the right to reference the Client in marketing as the Supplier’s customer. These rights survive the end of the Agreement."
    )
  } else if (state.radioReferenceRights !== 'noReferenceRights') {
    // No section is added in this case.
  } else {
    unexpectedError();
  }

  // 19. Takuu
  addSectionTitle(
    "Takuu",
    "Warranty"
  );
  addParagraph(
    "Toimittaja vastaa siitä, että konsultointi tehdään huolellisesti ja ammattitaitoisesti.",
    "The Supplier shall be responsible for ensuring that the consulting services are performed with due care and in professional manner."
  );
  addParagraph(
    "Konsultointi kunkin laskun kattaman konsultoinnin osalta katsotaan hyväksytyksi, jos Tilaaja ei ole tehnyt kirjallista huomautusta viimeistään laskun eräpäivään mennessä.",
    "The consulting services corresponding to an invoice are considered to be accepted by the Client if the Client has not notified the Supplier in writing of any objections by the due date of the invoice."
  );
  addParagraph(
    "Toimittajan vastuu konsultoinnin ja sen tulosten virheistä ja näiden seurauksista rajoittuu virheen korjaamiseen tai konsultoinnin uudelleen tekemiseen omalla kustannuksellaan ja edellyttää, että Tilaaja huomauttaa Toimittajalle virheestä kirjallisesti kyseisen konsultoinnin kattaman laskun eräpäivään mennessä.",
    "The Supplier shall correct the errors or re-perform consulting services at its own expense, provided that the Client notifies the Supplier of the error in writing by the due date of the invoice concerning the respective services. The duties set forth in this section define Supplier’s sole responsibilities and liabilities as well as exclusive remedies available for the Client in case of the any errors or deficiencies in the consulting services or deliverables thereof."
  );

  // 20. Yleiset vastuut ja velvoitteet
  addSectionTitle(
    "Yleiset vastuut ja velvoitteet",
    "General Responsibilities and Obligations"
  );
  addParagraph(
    "Osapuoli ei vastaa viivästyksestä tai vahingosta, joka johtuu osapuolen vaikutusmahdollisuuksien ulkopuolella olevasta esteestä ja jonka seurauksia osapuoli ei myöskään kohtuudella olisi voinut välttää tai voittaa.",
    "Neither party shall be liable for delay or damage resulting from an impediment beyond the party's control and whose consequences the party could not reasonably have avoided or overcome."
  );
  addParagraph(
    "Jos osapuoli havaitsee, että konsultointiin vaikuttava viivästys tapahtuu tai on todennäköinen, osapuolen on viipymättä ilmoitettava tästä ja sen vaikutuksista konsultointiin kirjallisesti toiselle sopijapuolelle.",
    "If a party finds that a delay affecting consulting will or is likely to occur , the party shall without delay notify this and its effects on consulting in writing to the other party."
  );
  addParagraph(
    "Kumpikin osapuoli vastaa siitä, että se tekee sopimuksen toteuttamiseksi tarvittavat päätökset viivytyksettä. Osapuolilla on velvollisuus myötävaikuttaa sopimuksen toteuttamiseen sellaisissa yhteyksissä, jotka ovat osapuolen määrättävissä tai hallinnassa.",
    "Each party is responsible for making decisions necessary for the performance of the Agreement without delay. Each party has an obligation to contribute to the provision of the Agreement in respect of factors that are under the command or control of the party."
  );
  addParagraph(
    "Tilaaja vastaa Toimittajalle antamistaan tiedoista, ohjeista ja määräyksistä sekä näiden mukaan tehdyn työn ja tuloksen soveltuvuudesta käyttötarkoitukseensa. Tilaaja vastaa siitä, että Toimittajalla on kulloinkin toimitettavan konsultoinnin osalta ajoissa käytettävissään riittävä ja sovittu materiaali ja tieto, jotka Toimittaja kohtuudella tarvitsee tai pyytää sovitun konsultoinnin toimittamiseen.",
    "The Client shall be responsible for information, instructions, and orders which it provides to the Supplier as well as for the suitability of the services and deliverables for their intended use when provided accordingly. The Client is responsible for ensuring that the Supplier has timely access to sufficient material and information that the Supplier reasonably needs or requests for purposes of providing the consulting services."
  );
  addParagraph(
    "Osapuolella on oikeus purkaa sopimus, jos toinen osapuoli rikkoo olennaisesti sopimusehtoja, eikä korjaa sopimusrikkomustaan sopimusrikkomuksesta huomauttavan osapuolen kirjallisesti asettaman kohtuullisen määräajan puitteissa.",
    "Each party has the right to terminate the Agreement if the other party materially breaches the terms of the Agreement and will not correct such breach within a reasonable period of time set in writing by the non-breaching party."
  );
  addParagraph(
    "Toimittajan vahingonkorvausvelvollisuus Tilaajalle on yhteensä enintään 50 prosenttia sopimuksen arvonlisäverottomasta kokonaishinnasta. Jos sopimus jatkuu yli vuoden, Toimittajan vahingonkorvausvelvollisuus on kunkin sopimusvuoden osalta yhteensä enintään 50 % kunkin sopimusvuoden toteutuneesta laskutuksesta kutakin sopimusvuotta kohti.",
    "The maximum liability for damages towards the Client shall not exceed in aggregate 50 percent of the Agreement's total price, excluding VAT. If the Agreement continues for over a year, the Supplier's aggregate liability for damages for each contract year shall not exceed 50% of that contract year's actual aggregate billing."
  );
  addParagraph(
    "Osapuolet eivät ole vastuussa toisilleen aiheutetuista välillisistä vahingoista.",
    "Neither party shall be liable for any indirect or consequential damages."
  );
  addParagraph(
    "Tässä kohdassa määritelty vastuunrajoitus ei kuitenkaan koske tahallisesti aiheutettua vahinkoa tai törkeää huolimattomuutta.",
    "However, the liability limitation defined in this section shall not apply to damages caused by willful conduct or gross negligence."
  );
  addParagraph(
    "Sopimuksen päättymisestä huolimatta sellaiset ehdot, jotka luonteensa puolesta on tarkoitettu jäämään voimaan sopimuksen päättyessä, jäävät voimaan.",
    "Notwithstanding the termination of the Agreement, such terms and provisions that by their nature are intended to remain in force after the Agreement ends, will survive termination."
  );

  // 21. Sovellettava laki
  addSectionTitle(
    "Sovellettava laki",
    "Applicable Law"
  );
  addParagraph(
    `Tähän sopimukseen sovelletaan Suomen lakia, ei kuitenkaan kansainvälistä lainvalintaa koskevia säännöksiä. Mikäli sopimusta koskevaa erimielisyyttä ei voida ratkaista neuvottelemalla, riita ratkaistaan lopullisesti ${state.getCourtInflectedForm(state.karajaoikeusValmis)}.`,
    `This Agreement shall be governed by the laws of Finland, without regard to its principles and rules on choice of laws. Any dispute, controversy or claim arising out of this Agreement, which cannot be resolved through negotiations within reasonable time, shall be resolved in ${state.getCourtInflectedForm(state.karajaoikeusValmis)}.`
  );

  // 22. Vapaateksti [OPTIONAL]
  if (state.checkboxVapaateksti && state.vapaatekstiValmis) {
    addSectionTitle(
      "Muuta",
      "Other"
    );
    addParagraph(
      `Osapuolet ovat lisäksi ja/tai edellä sovitusta poiketen sopineet seuraavaa: ${state.vapaatekstiValmis}`,
      `The parties have additionally and/or as modification to the above agreed upon the following: ${state.vapaatekstiValmis}`
    );
  }

  // 23. Allekirjoitukset
  if (yPos > 200) {
    // Making sure signature section fits entirely on the page
    doc.addPage();
    yPos = MARGIN_TOP;
  }
  addSectionTitle(
    "Allekirjoitukset",
    "Signatures"
  );
  yPos += 10;
  addParagraph(
    "Päivämäärä: ......................",
    "Date: ......................"
  );
  yPos += 20;
  doc.setFontSize(FONT_SIZE_PARAGRAPH);
  doc.setFont(FONT_NAME, "normal");
  if (state.currentLanguage === 'fi') {
    doc.text("Tilaajan puolesta", MARGIN_X, yPos);
    doc.text("Toimittajan puolesta", PAGE_WIDTH / 2 + 10, yPos);
  } else {
    doc.text("On behalf of the Client", MARGIN_X, yPos);
    doc.text("On behalf of the Supplier", PAGE_WIDTH / 2 + 10, yPos);
  }
  yPos += 20;
  doc.text("..................................................................", MARGIN_X, yPos);
  doc.text("..................................................................", PAGE_WIDTH / 2 + 10, yPos);
  yPos += 6;
  doc.text(state.tilaajanYhteyshenkiloValmis, MARGIN_X, yPos);
  doc.text(state.toimittajanYhteyshenkiloValmis, PAGE_WIDTH / 2 + 10, yPos);

  // Add page numbers
  doc.setFontSize(FONT_SIZE_PARAGRAPH);
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        text = `${i}/${pageCount}`, 
        x = doc.internal.pageSize.width - 13,
        y = 10
      );
  }

  // Add promotional text at the bottom of the last page
  const promotext = state.currentLanguage === 'fi' 
    ? "Sopimus luotu käyttäen ohjelmistofriikit.fi sopimuspohjaa." 
    : "This contract was created using ohjelmistofriikit.fi contract template.";
  doc.setFontSize(FONT_SIZE_PARAGRAPH);
  doc.setFont(FONT_NAME, "italic");
  doc.text(
    text = promotext,
    x = PAGE_WIDTH / 2,
    y = PAGE_HEIGHT - 10,
    options = { align: 'center' }
  );

  return doc.output('datauristring');
}