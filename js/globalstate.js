function getAlpineState() {
  // localStorage throws when storage is blocked (some privacy settings and embedded contexts);
  // the remembered language is optional, so the page must still work without it.
  let storedLanguage = null;
  try {
    storedLanguage = localStorage.getItem('contractGenerator_language');
  } catch {}

  return {
    // Language preference:
    // - if a supported lang is in query param, use that;
    // - else if a supported lang is in localStorage, use that;
    // - else default to 'fi'
    currentLanguage: [new URLSearchParams(window.location.search).get('lang'), storedLanguage]
      .find((lang) => Object.keys(translations).includes(lang)) || 'fi',

    changeLanguage(newLanguage) {
      try {
        localStorage.setItem('contractGenerator_language', newLanguage);
      } catch {}

      // Court names are language-specific, so map the selected court to the new language.
      // locations.fi and locations.en list the same courts in the same order.
      const oldCourts = Object.keys(locations[this.currentLanguage]);
      const newCourts = Object.keys(locations[newLanguage]);
      const translateCourt = (court) => newCourts[oldCourts.indexOf(court)] || court;
      const karajaoikeusRaaka = translateCourt(this.karajaoikeusRaaka);
      const karajaoikeusValmis = translateCourt(this.karajaoikeusValmis);

      this.currentLanguage = newLanguage;
      this.karajaoikeusRaaka = karajaoikeusRaaka;
      this.karajaoikeusValmis = karajaoikeusValmis;
      this.asetaOletusMatkustusalue();

      // x-model sets the court <select>'s value before its options re-render in the new language, so the
      // select would show the wrong court. Re-apply the value once the options exist. ($nextTick, :selected,
      // :key on the options and reordering these assignments were all tried and don't fix it.)
      setTimeout(() => {
        const courtSelect = document.getElementById('karajaoikeus');
        if (courtSelect) {
          courtSelect.value = this.karajaoikeusRaaka;
        }
      });

      // A generated PDF is in the old language; drop it (hides the preview) so the user generates it again.
      this.setPdfUrl('');

      // Finnish is the default; only English is kept in the URL (for sharing).
      const url = new URL(window.location);
      if (newLanguage === 'en') {
        url.searchParams.set('lang', 'en');
      } else {
        url.searchParams.delete('lang');
      }
      window.history.replaceState({}, '', url);
    },

    // Translation helper method with fallback to key
    t(key) {
      return translations[this.currentLanguage]?.[key] ?? key;
    },

    // Validation functions
    validateEmail(email) {
      if (!email || !email.trim()) {
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    },

    validatePhone(phone) {
      if (!phone || !phone.trim()) {
        return false;
      }
      // Phone number validation
      // Accepts a variety of formats like +358401234567, 00358401234567, 040 123 4567, 040-1234567
      // Accepts business numbers like 010 584 1124
      // Accepts international numbers like +885038546712 or (555) 317-492 
      // Accepts short numbers like old Saunalahti numbers
      const phoneRegex = /^\+?[()-\s0-9]{6,25}$/;
      return phoneRegex.test(phone.trim().replace(/\s/g, ''));
    },

    validateYtunnus(ytunnus) {
      if (!ytunnus || !ytunnus.trim()) {
        return false;
      }

      const trimmedYtunnus = ytunnus.trim();

      // Check format: XXXXXXX-Y (7 digits, dash, 1 digit)
      const ytunnusRegex = /^\d{7}-\d{1}$/;
      if (!ytunnusRegex.test(trimmedYtunnus)) {
        return false;
      }

      // Extract digits and check digit
      const digits = trimmedYtunnus.replace('-', '');
      const checkDigit = parseInt(digits.charAt(7));

      // Weights for Y-tunnus validation
      const weights = [7, 9, 10, 5, 8, 4, 2];
      let sum = 0;

      // Calculate weighted sum
      for (let i = 0; i < 7; i++) {
        sum += parseInt(digits.charAt(i)) * weights[i];
      }

      // Calculate check digit
      let calculatedCheckDigit = (11 - (sum % 11)) % 11;

      // Validate check digit
      return checkDigit === calculatedCheckDigit;
    },

    // Converts YYYY-MM-DD (date input value) to DD.MM.YYYY. Splits the string instead of
    // using new Date(), which parses it as UTC and can shift the day in negative timezones.
    formatIsoDate(isoDate) {
      if (!isoDate) {
        return '';
      }
      const [year, month, day] = isoDate.split('-');
      return `${day}.${month}.${year}`;
    },

    // Prevents issues with initial page load
    piilotaFormi: true,

    // Karajaoikeus vaihtoehdot
    courts: {
      fi: [...Object.keys(locations.fi)].sort((a, b) => a.localeCompare(b)),
      en: [...Object.keys(locations.en)].sort((a, b) => a.localeCompare(b)),
    },

    getCourts() {
      return this.courts[this.currentLanguage];
    },

    getCourtInflectedForm(court) {
      if (this.currentLanguage === 'fi') {
        return court.replace("oikeus", "oikeudessa");
      }
      return court;
    },

    // Tuntihinta liittyen laskutusmuotoon tuntilaskutus
    radioLaskutusmuoto: '',
    tuntihintaRaaka: '',
    tuntihintaValmis: '',
    kirjaaValmisTuntihinta() {
      this.tuntihintaValmis = this.tuntihintaRaaka;

      // Special thing here: default value for ylityökorvaus is 50% of the hourly rate.
      const oletus = this.getOletusYlityokorvaus();
      if (!this.ylityokorvaustaMuokattuManuaalisesti && oletus) {
        this.ylityokorvausRaaka = oletus;
        this.ylityokorvausValmis = oletus;
      }
    },

    // Urakkahinta liittyen laskutusmuotoon urakkalaskutus
    urakkahintaRaaka: '',
    urakkahintaValmis: '',
    kirjaaValmisUrakkahinta() {
      this.urakkahintaValmis = this.urakkahintaRaaka;
    },

    // Milloin fieldset laskutusperuste on valmis
    onkoValmisFieldsetLaskutusperuste() {
      if (this.radioLaskutusmuoto === 'tuntilaskutus') {
        return this.tuntihintaValmis;
      } else if (this.radioLaskutusmuoto === 'urakkalaskutus') {
        return this.urakkahintaValmis;
      }
      return false;
    },

    // Tuntimäärä liittyen sovittuun allokaatioon tuntilaskutuksessa
    radioAllokaatio: '',
    tuntejaViikossaRaaka: '',
    tuntejaViikossaValmis: '',
    kirjaaValmisTuntejaViikossa() {
      this.tuntejaViikossaValmis = this.tuntejaViikossaRaaka;
    },

    // Alkupäivämäärä liittyen voimaantuloon tuntilaskutuksessa jossa on sovittu allokaatio
    alkupaivamaaraRaaka: '',
    alkupaivamaaraValmis: '',
    kirjaaValmisAlkupaivamaara() {
      this.alkupaivamaaraValmis = this.formatIsoDate(this.alkupaivamaaraRaaka);
    },

    // Loppupäivämäärä liittyen voimassaoloon tuntilaskutuksessa
    radioVoimassaolo: '',
    loppupaivamaaraRaaka: '',
    loppupaivamaaraValmis: '',
    kirjaaValmisLoppupaivamaara() {
      this.loppupaivamaaraValmis = this.formatIsoDate(this.loppupaivamaaraRaaka);
    },

    // Milloin fieldset tuntimäärä on valmis ("tarpeettomat" tsekkaukset tässä eivät ole tarpeettomia vaan auttavat fokuksessa ja transitioissa)
    tuntimaaraValmis: false,
    onkoValmisFieldsetTuntimaara() {
      if (!this.tuntimaaraValmis) {
        return false;
      }
      // For nollatuntisopimus, we only need voimassaolo to be selected
      if (this.radioAllokaatio === 'nollatuntisopimus') {
        return this.radioVoimassaolo === 'toistaiseksi' || this.loppupaivamaaraValmis;
      }
      // For sovittu-allokaatio, we need also starting date and allocation hours to be set
      return (this.loppupaivamaaraValmis || this.radioVoimassaolo === 'toistaiseksi') && this.alkupaivamaaraValmis && this.tuntejaViikossaValmis;
    },

    // Tilaajan (client) and toimittajan (supplier) details. Both parties have the same fields, so
    // the commit/validation logic is shared: `osapuoli` is the field-name prefix, 'tilaajan' or
    // 'toimittajan', e.g. kirjaaValmisYtunnus('tilaajan') commits tilaajanYtunnusRaaka.
    // *Error / *Warning hold translation keys, translated in the template so they follow language switches.
    kirjaaValmisTeksti(osapuoli, kentta) {
      this[`${osapuoli}${kentta}Valmis`] = this[`${osapuoli}${kentta}Raaka`];
    },
    kirjaaValmisYtunnus(osapuoli) {
      const ytunnus = this[`${osapuoli}YtunnusRaaka`].trim();
      if (!ytunnus) {
        // Y-tunnus is empty, don't allow user to proceed.
        this[`${osapuoli}YtunnusValmis`] = '';
        this[`${osapuoli}YtunnusError`] = 'ytunnusRequired';
        this[`${osapuoli}YtunnusWarning`] = '';
        return;
      }
      // An invalid Y-tunnus only warns and still lets the user proceed. This is primarily intended to make
      // it as frictionless as possible to test the contract generator with fake data. Secondarily, this is
      // intended to allow making contracts with foreign business entities.
      this[`${osapuoli}YtunnusValmis`] = ytunnus;
      this[`${osapuoli}YtunnusError`] = '';
      this[`${osapuoli}YtunnusWarning`] = this.validateYtunnus(ytunnus) ? '' : 'ytunnusInvalid';
    },
    kirjaaValmisEmail(osapuoli) {
      const email = this[`${osapuoli}EmailRaaka`].trim();
      const valid = this.validateEmail(email);
      this[`${osapuoli}EmailValmis`] = valid ? email : '';
      this[`${osapuoli}EmailError`] = valid ? '' : email ? 'emailInvalid' : 'emailRequired';
    },
    kirjaaValmisPuhelin(osapuoli) {
      const phone = this[`${osapuoli}PuhelinRaaka`].trim();
      const valid = this.validatePhone(phone);
      this[`${osapuoli}PuhelinValmis`] = valid ? phone : '';
      this[`${osapuoli}PuhelinError`] = valid ? '' : phone ? 'phoneInvalid' : 'phoneRequired';
    },
    onkoValmisOsapuoli(osapuoli) {
      return ['Yritys', 'Ytunnus', 'Yhteyshenkilo', 'Email', 'Puhelin'].every((field) => this[`${osapuoli}${field}Valmis`]);
    },

    // Tilaaja
    tilaajanYritysRaaka: '',
    tilaajanYritysValmis: '',
    tilaajanYtunnusRaaka: '',
    tilaajanYtunnusValmis: '',
    tilaajanYtunnusError: '',
    tilaajanYtunnusWarning: '',
    tilaajanYhteyshenkiloRaaka: '',
    tilaajanYhteyshenkiloValmis: '',
    tilaajanEmailRaaka: '',
    tilaajanEmailValmis: '',
    tilaajanEmailError: '',
    tilaajanPuhelinRaaka: '',
    tilaajanPuhelinValmis: '',
    tilaajanPuhelinError: '',
    onkoValmisFieldsetTilaajanTiedot() {
      return this.onkoValmisOsapuoli('tilaajan');
    },

    // Toimittaja
    toimittajanYritysRaaka: '',
    toimittajanYritysValmis: '',
    toimittajanYtunnusRaaka: '',
    toimittajanYtunnusValmis: '',
    toimittajanYtunnusError: '',
    toimittajanYtunnusWarning: '',
    toimittajanYhteyshenkiloRaaka: '',
    toimittajanYhteyshenkiloValmis: '',
    toimittajanEmailRaaka: '',
    toimittajanEmailValmis: '',
    toimittajanEmailError: '',
    toimittajanPuhelinRaaka: '',
    toimittajanPuhelinValmis: '',
    toimittajanPuhelinError: '',
    onkoValmisFieldsetToimittajanTiedot() {
      return this.onkoValmisOsapuoli('toimittajan');
    },

    // Projektin tiedot
    projektinNimiRaaka: '',
    projektinNimiValmis: '',
    kirjaaValmisProjektinNimi() {
      this.projektinNimiValmis = this.projektinNimiRaaka;
    },
    radioKonsultinRooli: '',
    konsultinRooliValmis: false,
    muuRooliRaaka: '',
    muuRooliValmis: '',
    kirjaaValmisMuuRooli() {
      this.muuRooliValmis = this.muuRooliRaaka;
    },
    onkoValmisFieldsetProjektinTiedot() {
      if (!this.projektinNimiValmis || !this.radioKonsultinRooli || !this.konsultinRooliValmis) {
        return false;
      }
      if (this.radioKonsultinRooli === 'radioConsultantRoleOther') {
        return this.muuRooliValmis;
      }
      return true;
    },

    // Irtisanomisaika liittyen sovittuun allokaatioon tuntilaskutuksessa
    irtisanomisaikaViikoissaRaaka: '4',
    irtisanomisaikaViikoissaValmis: '4',
    kirjaaValmisIrtisanomisaikaViikoissa() {
      this.irtisanomisaikaViikoissaValmis = this.irtisanomisaikaViikoissaRaaka;
    },

    // Aineettomat oikeudet
    radioIPR: '',
    iprValmis: false,
    onkoValmisFieldsetIPR() {
      return this.radioIPR && this.iprValmis;
    },

    // Sijainti
    radioSijainti: '',
    sijaintiValmis: false,
    onkoValmisFieldsetSijainti() {
      return this.sijaintiValmis && this.radioSijainti;
    },

    // Karajaoikeus
    karajaoikeusRaaka: '',
    karajaoikeusValmis: '',
    kirjaaValmisKarajaoikeus() {
      this.karajaoikeusValmis = this.karajaoikeusRaaka;

      // Special thing here: default value for matkustusalue is set based on karajaoikeus.
      this.asetaOletusMatkustusalue();
    },
    onkoValmisFieldsetKarajaoikeus() {
      return this.karajaoikeusValmis;
    },

    // Työajat
    radioTyoajat: '',
    tyoajatValmis: false,
    onkoValmisFieldsetTyoajat() {
      return this.tyoajatValmis && this.radioTyoajat;
    },

    // Työvälineet
    radioTyovalineet: '',
    tyovalineetValmis: false,
    onkoValmisFieldsetTyovalineet() {
      return this.tyovalineetValmis && this.radioTyovalineet;
    },

    // Referenssioikeus
    radioReferenceRights: '',
    referenceRightsValmis: false,
    onkoValmisFieldsetReferenceRights() {
      return this.referenceRightsValmis && this.radioReferenceRights;
    },

    // Muut
    maksuaikaRaaka: '14',
    maksuaikaValmis: '14',
    kirjaaValmisMaksuaika() {
      this.maksuaikaValmis = this.maksuaikaRaaka;
    },
    matkakorvausRaaka: '25',
    matkakorvausValmis: '25',
    kirjaaValmisMatkakorvaus() {
      this.matkakorvausValmis = this.matkakorvausRaaka;
    },
    matkustusalueRaaka: '',
    matkustusalueValmis: '',
    matkustusaluettaMuokattuManuaalisesti: false,
    kirjaaValmisMatkustusalue() {
      this.matkustusalueValmis = this.matkustusalueRaaka;
      // Only count it as edited if it differs from the court's default (blur alone doesn't count).
      this.matkustusaluettaMuokattuManuaalisesti = this.matkustusalueRaaka !== this.getOletusMatkustusalue();
    },
    getOletusMatkustusalue(lang = this.currentLanguage) {
      return locations[lang][this.karajaoikeusValmis] || '';
    },
    // Resets matkustusalue to the court's default, unless the user has edited it.
    asetaOletusMatkustusalue(lang = this.currentLanguage) {
      if (!this.matkustusaluettaMuokattuManuaalisesti) {
        this.matkustusalueRaaka = this.getOletusMatkustusalue(lang);
        this.matkustusalueValmis = this.matkustusalueRaaka;
      }
    },
    checkboxYlityokorvaus: true,
    ylityokorvausRaaka: '50',
    ylityokorvausValmis: '50',
    ylityokorvaustaMuokattuManuaalisesti: false,
    kirjaaValmisYlityokorvaus() {
      this.ylityokorvausValmis = this.ylityokorvausRaaka;
      // Only count it as edited if it differs from the default (blur alone doesn't count).
      this.ylityokorvaustaMuokattuManuaalisesti = this.ylityokorvausRaaka !== (this.getOletusYlityokorvaus() || '50');
    },
    // 50% of the hourly rate, as a string; '' if the rate isn't a positive number. Accepts "100,00".
    getOletusYlityokorvaus() {
      const tuntihinta = parseFloat(String(this.tuntihintaValmis).replace(',', '.'));
      return tuntihinta > 0 ? String(Math.round(tuntihinta / 2)) : '';
    },
    checkboxHoukuttelukielto: false,
    checkboxVapaateksti: false,
    vapaatekstiRaaka: '',
    vapaatekstiValmis: '',
    kirjaaValmisVapaateksti() {
      this.vapaatekstiValmis = this.vapaatekstiRaaka;
    },

    // This is a bit awkward as 'muut' section is pre-filled ("ready") by default.
    // We still want the user to indicate that they have confirmed the 'muut' section.
    // In addition, we want to prepare for the possibility that the user might
    // break the pre-filled overtime value.
    userIndicatedMuutIsValmis: false,
    // Whether the required 'muut' fields are filled in. Uses the raw values so the warning and the
    // continue button react while typing. The notice period is only used with an agreed allocation.
    onkoMuutTaytetty() {
      return this.matkakorvausRaaka && this.matkustusalueRaaka && this.maksuaikaRaaka
        && (!this.checkboxYlityokorvaus || this.ylityokorvausRaaka)
        && (!this.onkoSovittuAllokaatio() || this.irtisanomisaikaViikoissaRaaka);
    },
    onkoSovittuAllokaatio() {
      return this.radioLaskutusmuoto === 'tuntilaskutus' && this.radioAllokaatio === 'sovittu-allokaatio';
    },
    onkoValmisFieldsetMuut() {
      return this.userIndicatedMuutIsValmis && this.onkoMuutTaytetty();
    },

    getConsultantRoleText(inflected = false) {
      if (this.radioKonsultinRooli === 'radioConsultantRoleOther') {
        // Special case: if radio 'other' is selected, we return the value of nearby input text field, unless it is empty, in which case we fallback to "other"
        if (!inflected) {
          return this.muuRooliValmis || this.t('radioConsultantRoleOther');
        }
        return `${this.t('inRole')} ${this.muuRooliValmis || this.t('radioConsultantRoleOther')}`;
      }
      // Typical case
      if (!inflected) {
        return this.t(this.radioKonsultinRooli);
      }
      return this.t(`${this.radioKonsultinRooli}Inflected`);
    },

    tarvittaessaScrollaaAlas() {
      // Tarvitaan timeout jotta AlpineJS ehtii muuttamaan DOM-elementit
      setTimeout(() => {
        const pohja = document.getElementById('pohja');
        if (!pohja) return;

        // Jos pohja ei ole näkyvissä, scrollaa pohjaan
        const rect = pohja.getBoundingClientRect();
        const isVisible = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        if (!isVisible) {
          pohja.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        }
      }, 60)
    },

    // Section progression state
    // NOTE: Don't refactor these to boolean flags. There are 2 reasons for this:
    // 1. Users can go back and modify previous sections, which in some cases changes which sections should be shown.
    // 2. We want users to be able to progress with ONE click of the continue button, rather than two clicks (defocus-click and change-state-click).
    // Each step is shown once the previous *shown* step is complete, so the visible steps are always
    // a prefix of the form: stale answers in a step that no longer applies (e.g. work hours after
    // switching from remote to on-site) can't reveal the steps after it.
    showTuntimaara() {
      return this.onkoValmisFieldsetLaskutusperuste() && this.radioLaskutusmuoto === 'tuntilaskutus';
    },
    showTilaajanTiedot() {
      if (this.showTuntimaara()) {
        return this.onkoValmisFieldsetTuntimaara();
      }
      return this.onkoValmisFieldsetLaskutusperuste();
    },
    showToimittajanTiedot() {
      return this.showTilaajanTiedot() && this.onkoValmisFieldsetTilaajanTiedot();
    },
    showProjektinTiedot() {
      return this.showToimittajanTiedot() && this.onkoValmisFieldsetToimittajanTiedot();
    },
    showIPR() {
      return this.showProjektinTiedot() && this.onkoValmisFieldsetProjektinTiedot();
    },
    showSijainti() {
      return this.showIPR() && this.onkoValmisFieldsetIPR();
    },
    showTyoajat() {
      return this.showSijainti() && this.onkoValmisFieldsetSijainti() && this.radioSijainti === 'etana';
    },
    showTyovalineet() {
      return this.showSijainti() && this.onkoValmisFieldsetSijainti() && this.radioSijainti === 'lasna';
    },
    showReferenceRights() {
      return (this.showTyoajat() && this.onkoValmisFieldsetTyoajat()) || (this.showTyovalineet() && this.onkoValmisFieldsetTyovalineet());
    },
    showKarajaoikeus() {
      return this.showReferenceRights() && this.onkoValmisFieldsetReferenceRights();
    },
    showMuut() {
      return this.showKarajaoikeus() && this.onkoValmisFieldsetKarajaoikeus();
    },

    // The form's steps in order. Drives the progress bar, the continue button's label and whether it's enabled.
    // - shown: the step is visible (see show*() above; the shown steps are always a prefix of this list)
    // - filled: its fields have values (raw values, so the button enables while typing)
    // - done: the step is complete (committed values)
    // - label: the continue-button text while this is the first step not shown yet
    getSteps() {
      const osapuoliFilled = (osapuoli) => ['Yritys', 'Ytunnus', 'Yhteyshenkilo', 'Email', 'Puhelin'].every((kentta) => this[`${osapuoli}${kentta}Raaka`]);
      const steps = [
        {
          shown: true,
          filled: this.radioLaskutusmuoto === 'tuntilaskutus' ? this.tuntihintaRaaka : this.radioLaskutusmuoto === 'urakkalaskutus' && this.urakkahintaRaaka,
          done: this.onkoValmisFieldsetLaskutusperuste(),
        },
        this.radioLaskutusmuoto === 'tuntilaskutus' && {
          label: 'continueToHours',
          shown: this.showTuntimaara(),
          filled: this.radioAllokaatio && this.radioVoimassaolo
            && (this.radioVoimassaolo !== 'eraantyy' || this.loppupaivamaaraRaaka)
            && (this.radioAllokaatio !== 'sovittu-allokaatio' || (this.tuntejaViikossaRaaka && this.alkupaivamaaraRaaka)),
          done: this.onkoValmisFieldsetTuntimaara(),
        },
        { label: 'continueToClientInfo', shown: this.showTilaajanTiedot(), filled: osapuoliFilled('tilaajan'), done: this.onkoValmisFieldsetTilaajanTiedot() },
        { label: 'continueToSupplierInfo', shown: this.showToimittajanTiedot(), filled: osapuoliFilled('toimittajan'), done: this.onkoValmisFieldsetToimittajanTiedot() },
        {
          label: 'continueToProject',
          shown: this.showProjektinTiedot(),
          filled: this.radioKonsultinRooli && this.projektinNimiRaaka && (this.radioKonsultinRooli !== 'radioConsultantRoleOther' || this.muuRooliRaaka),
          done: this.onkoValmisFieldsetProjektinTiedot(),
        },
        { label: 'continueToIPR', shown: this.showIPR(), filled: this.radioIPR, done: this.onkoValmisFieldsetIPR() },
        { label: 'continueToLocation', shown: this.showSijainti(), filled: this.radioSijainti, done: this.onkoValmisFieldsetSijainti() },
        // Work hours (remote) or work equipment (on-site); which one isn't known until a location is picked.
        {
          label: { etana: 'continueToWorkHours', lasna: 'continueToWorkEquipment' }[this.radioSijainti] || 'continue',
          shown: this.showTyoajat() || this.showTyovalineet(),
          filled: this.radioSijainti === 'etana' ? this.radioTyoajat : this.radioTyovalineet,
          done: this.onkoValmisFieldsetSijainti() && (this.radioSijainti === 'etana' ? this.onkoValmisFieldsetTyoajat() : this.onkoValmisFieldsetTyovalineet()),
        },
        { label: 'continueToReferenceRights', shown: this.showReferenceRights(), filled: this.radioReferenceRights, done: this.onkoValmisFieldsetReferenceRights() },
        { label: 'continueToKarajaoikeus', shown: this.showKarajaoikeus(), filled: this.karajaoikeusRaaka, done: this.onkoValmisFieldsetKarajaoikeus() },
        { label: 'continueToMuut', shown: this.showMuut(), filled: this.onkoMuutTaytetty(), done: this.onkoValmisFieldsetMuut() },
      ];
      return steps.filter(Boolean);
    },

    getFormProgress() {
      const steps = this.getSteps();
      return Math.round((steps.filter((step) => step.done).length / steps.length) * 100);
    },

    getContinueButtonText() {
      const nextStep = this.getSteps().find((step) => !step.shown);
      if (nextStep) return this.t(nextStep.label);
      return this.t(this.getFormProgress() < 100 ? 'continue' : 'continueToGenerate');
    },

    // The continue button is enabled when every shown step is filled in. When all are, it is enabled
    // (and yellow) both for "collapse the 'muut' section" and for "generate the contract".
    canContinue() {
      return this.getSteps().every((step) => !step.shown || step.filled);
    },

    // blob: URL of the generated PDF, shared by the preview and the download. The preview is shown while it's set.
    pdfUrl: '',
    setPdfUrl(url) {
      if (this.pdfUrl) {
        URL.revokeObjectURL(this.pdfUrl);
      }
      this.pdfUrl = url;
    },
    continueClicked() {
      if (this.getFormProgress() < 100) {
        // Nothing happens other than defocus, which we use to progress through the form
        return;
      }
      if (this.radioLaskutusmuoto === 'urakkalaskutus') {
        // Remind user that attachment is required for urakkalaskutus
        if (!confirm(this.t('attachmentReminder'))) {
          return;
        }
      }

      this.setPdfUrl(URL.createObjectURL(getPDF(this)));
      document.getElementById('pdf-viewer').src = `vendor/pdfjs/web/viewer.html?file=${encodeURIComponent(this.pdfUrl)}`;
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 30);
    },

    downloadClicked() {
      const sanitizedClientName = this.tilaajanYritysValmis.replace(/[^a-zA-Z0-9åäöÅÄÖ\s]/g, '').replace(/\s+/g, '_');
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
      const prefix = this.currentLanguage === 'en' ? 'ConsultingContract' : 'Konsultointisopimus';

      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.download = `${prefix}_${sanitizedClientName}_${formattedDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}