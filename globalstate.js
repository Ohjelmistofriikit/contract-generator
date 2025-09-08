function getAlpineState() {
  return {
    // Language helpers
    currentLanguage: localStorage.getItem('contractGenerator_language') || 'fi',
    changeLanguage(newLanguage) {
      localStorage.setItem('contractGenerator_language', newLanguage);
      this.currentLanguage = newLanguage;
    },
    t(key) {
      // Translation helper method with fallback to key
      return translations[this.currentLanguage]?.[key] || key;
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
      // Finnish phone number validation: accepts formats like +358401234567, 0401234567, 050-1234567, etc.
      const phoneRegex = /^(\+358|0)[-\s]?[4-5]\d{1}[-\s]?\d{3}[-\s]?\d{4}$/;
      return phoneRegex.test(phone.trim().replace(/\s/g, ''));
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
      if (!this.ylityokorvaustaMuokattuManuaalisesti) {
        this.ylityokorvausRaaka = Math.round((this.tuntihintaRaaka * 0.5));
        this.ylityokorvausValmis = this.ylityokorvausRaaka;
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
        return this.tuntihintaValmis && this.tuntihintaValmis;
      } else if (this.radioLaskutusmuoto === 'urakkalaskutus') {
        return this.urakkahintaValmis && this.urakkahintaValmis;
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
      if (this.alkupaivamaaraRaaka) {
        // Convert from YYYY-MM-DD to DD.MM.YYYY for display
        const date = new Date(this.alkupaivamaaraRaaka);
        this.alkupaivamaaraValmis = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
      } else {
        this.alkupaivamaaraValmis = '';
      }
    },

    // Loppupäivämäärä liittyen voimassaoloon tuntilaskutuksessa
    radioVoimassaolo: '',
    loppupaivamaaraRaaka: '',
    loppupaivamaaraValmis: '',
    kirjaaValmisLoppupaivamaara() {
      if (this.loppupaivamaaraRaaka) {
        // Convert from YYYY-MM-DD to DD.MM.YYYY for display
        const date = new Date(this.loppupaivamaaraRaaka);
        this.loppupaivamaaraValmis = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
      } else {
        this.loppupaivamaaraValmis = '';
      }
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

    // Tilaaja
    tilaajanYritysRaaka: '',
    tilaajanYritysValmis: '',
    kirjaaValmisTilaajanYritys() {
      this.tilaajanYritysValmis = this.tilaajanYritysRaaka;
    },
    tilaajanYtunnusRaaka: '',
    tilaajanYtunnusValmis: '',
    kirjaaValmisTilaajanYtunnus() {
      this.tilaajanYtunnusValmis = this.tilaajanYtunnusRaaka;
    },
    tilaajanYhteyshenkiloRaaka: '',
    tilaajanYhteyshenkiloValmis: '',
    kirjaaValmisTilaajanYhteyshenkilo() {
      this.tilaajanYhteyshenkiloValmis = this.tilaajanYhteyshenkiloRaaka;
    },
    tilaajanEmailRaaka: '',
    tilaajanEmailValmis: '',
    tilaajanEmailError: '',
    kirjaaValmisTilaajanEmail() {
      const trimmedEmail = this.tilaajanEmailRaaka.trim();
      if (this.validateEmail(trimmedEmail)) {
        this.tilaajanEmailValmis = trimmedEmail;
        this.tilaajanEmailError = '';
      } else {
        this.tilaajanEmailValmis = '';
        this.tilaajanEmailError = trimmedEmail ? this.t('emailInvalid') : this.t('emailRequired');
      }
    },
    tilaajanPuhelinRaaka: '',
    tilaajanPuhelinValmis: '',
    tilaajanPuhelinError: '',
    kirjaaValmisTilaajanPuhelin() {
      const trimmedPhone = this.tilaajanPuhelinRaaka.trim();
      if (this.validatePhone(trimmedPhone)) {
        this.tilaajanPuhelinValmis = trimmedPhone;
        this.tilaajanPuhelinError = '';
      } else {
        this.tilaajanPuhelinValmis = '';
        this.tilaajanPuhelinError = trimmedPhone ? this.t('phoneInvalid') : this.t('phoneRequired');
      }
    },
    onkoValmisFieldsetTilaajanTiedot() {
      return this.tilaajanYritysValmis && this.tilaajanYtunnusValmis && this.tilaajanYhteyshenkiloValmis && this.tilaajanEmailValmis && this.tilaajanPuhelinValmis;
    },

    // Toimittaja
    toimittajanYritysRaaka: '',
    toimittajanYritysValmis: '',
    kirjaaValmisToimittajanYritys() {
      this.toimittajanYritysValmis = this.toimittajanYritysRaaka;
    },
    toimittajanYtunnusRaaka: '',
    toimittajanYtunnusValmis: '',
    kirjaaValmisToimittajanYtunnus() {
      this.toimittajanYtunnusValmis = this.toimittajanYtunnusRaaka;
    },
    toimittajanYhteyshenkiloRaaka: '',
    toimittajanYhteyshenkiloValmis: '',
    kirjaaValmisToimittajanYhteyshenkilo() {
      this.toimittajanYhteyshenkiloValmis = this.toimittajanYhteyshenkiloRaaka;
    },
    toimittajanEmailRaaka: '',
    toimittajanEmailValmis: '',
    toimittajanEmailError: '',
    kirjaaValmisToimittajanEmail() {
      const trimmedEmail = this.toimittajanEmailRaaka.trim();
      if (this.validateEmail(trimmedEmail)) {
        this.toimittajanEmailValmis = trimmedEmail;
        this.toimittajanEmailError = '';
      } else {
        this.toimittajanEmailValmis = '';
        this.toimittajanEmailError = trimmedEmail ? this.t('emailInvalid') : this.t('emailRequired');
      }
    },
    toimittajanPuhelinRaaka: '',
    toimittajanPuhelinValmis: '',
    toimittajanPuhelinError: '',
    kirjaaValmisToimittajanPuhelin() {
      const trimmedPhone = this.toimittajanPuhelinRaaka.trim();
      if (this.validatePhone(trimmedPhone)) {
        this.toimittajanPuhelinValmis = trimmedPhone;
        this.toimittajanPuhelinError = '';
      } else {
        this.toimittajanPuhelinValmis = '';
        this.toimittajanPuhelinError = trimmedPhone ? this.t('phoneInvalid') : this.t('phoneRequired');
      }
    },
    onkoValmisFieldsetToimittajanTiedot() {
      return this.toimittajanYritysValmis && this.toimittajanYtunnusValmis && this.toimittajanYhteyshenkiloValmis && this.toimittajanEmailValmis && this.toimittajanPuhelinValmis;
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
    onkoValmisFieldsetIrtisanomisaika() {
      return this.irtisanomisaikaViikoissaValmis;
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
      if (!this.matkustusaluettaMuokattuManuaalisesti) {
        this.matkustusalueRaaka = locations[this.currentLanguage][this.karajaoikeusRaaka] || '';
        this.matkustusalueValmis = this.matkustusalueRaaka;
      }
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
      this.maksuaikaValmis = this.maksuaikaRaaka || '14';
    },
    matkakorvausRaaka: '25',
    matkakorvausValmis: '25',
    kirjaaValmisMatkakorvaus() {
      this.matkakorvausValmis = this.matkakorvausRaaka || '25';
    },
    matkustusalueRaaka: '',
    matkustusalueValmis: '',
    matkustusaluettaMuokattuManuaalisesti: false,
    kirjaaValmisMatkustusalue() {
      this.matkustusalueValmis = this.matkustusalueRaaka;
      this.matkustusaluettaMuokattuManuaalisesti = true;
    },
    checkboxYlityokorvaus: true,
    ylityokorvausRaaka: '50',
    ylityokorvausValmis: '50',
    ylityokorvaustaMuokattuManuaalisesti: false,
    kirjaaValmisYlityokorvaus() {
      this.ylityokorvausValmis = this.ylityokorvausRaaka;
      this.ylityokorvaustaMuokattuManuaalisesti = true;
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
    onkoValmisFieldsetMuut() {
      return this.userIndicatedMuutIsValmis && this.matkakorvausRaaka && this.matkustusalueRaaka && this.maksuaikaRaaka && (!this.checkboxYlityokorvaus || this.ylityokorvausValmis);
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
      return this.onkoValmisFieldsetTilaajanTiedot();
    },
    showProjektinTiedot() {
      return this.onkoValmisFieldsetToimittajanTiedot();
    },
    showIPR() {
      return this.onkoValmisFieldsetProjektinTiedot();
    },
    showSijainti() {
      return this.onkoValmisFieldsetIPR();
    },
    showTyoajat() {
      return this.onkoValmisFieldsetSijainti() && this.radioSijainti == 'etana';
    },
    showTyovalineet() {
      return this.onkoValmisFieldsetSijainti() && this.radioSijainti == 'lasna';
    },
    showReferenceRights() {
      return this.onkoValmisFieldsetTyoajat() || this.onkoValmisFieldsetTyovalineet();
    },
    showKarajaoikeus() {
      return this.onkoValmisFieldsetReferenceRights();
    },
    showMuut() {
      return this.onkoValmisFieldsetKarajaoikeus();
    },

    getFormProgress() {
      const totalSteps = this.radioLaskutusmuoto === 'tuntilaskutus' ? 11 : 10;

      // Count always starts at 1, because progress indicator will not be visible until laskutusperuste is filled
      let completedSteps = 1;

      // If laskutusmuoto is tuntilaskutus, we have 1 additional top level fieldset: tuntimaara
      if (this.radioLaskutusmuoto === 'tuntilaskutus') {
        if (this.onkoValmisFieldsetTuntimaara()) {
          // Allocation fieldset is completed so +1
          completedSteps++;
        }
      }

      // Location remote/on-site affects which one of 2 top level fieldsets is shown after that one
      // (the other one we don't need to show to the user, because we can already provide the correct answer for it based on location).
      if (this.onkoValmisFieldsetSijainti()) {
        completedSteps++;
        if (this.radioSijainti === 'etana' && this.onkoValmisFieldsetTyoajat()) completedSteps++;
        if (this.radioSijainti === 'lasna' && this.onkoValmisFieldsetTyovalineet()) completedSteps++;
      }

      // Other top-level fieldsets will be always required
      if (this.onkoValmisFieldsetTilaajanTiedot()) completedSteps++;
      if (this.onkoValmisFieldsetToimittajanTiedot()) completedSteps++;
      if (this.onkoValmisFieldsetProjektinTiedot()) completedSteps++;
      if (this.onkoValmisFieldsetIPR()) completedSteps++;
      if (this.onkoValmisFieldsetReferenceRights()) completedSteps++;
      if (this.onkoValmisFieldsetKarajaoikeus()) completedSteps++;
      if (this.onkoValmisFieldsetMuut()) completedSteps++;

      // Calculate current progress
      return Math.round((completedSteps / totalSteps) * 100);
    },

    // Get the text for the continue button based on current state
    getContinueButtonText() {
      if (!this.showTuntimaara() && this.radioLaskutusmuoto === 'tuntilaskutus') return this.t('continueToHours');
      if (!this.showTilaajanTiedot()) return this.t('continueToClientInfo');
      if (!this.showToimittajanTiedot()) return this.t('continueToSupplierInfo');
      if (!this.showProjektinTiedot()) return this.t('continueToProject');
      if (!this.showIPR()) return this.t('continueToIPR');
      if (!this.showSijainti()) return this.t('continueToLocation');
      if (!this.showTyoajat() && this.radioSijainti === 'etana') return this.t('continueToWorkHours');
      if (!this.showTyovalineet() && this.radioSijainti === 'lasna') return this.t('continueToWorkEquipment');
      if (!this.showTyoajat() && !this.showTyovalineet() && !this.radioSijainti === '') return this.t('continue'); // Awkward but what else can we do here?
      if (!this.showReferenceRights()) return this.t('continueToReferenceRights');
      if (!this.showKarajaoikeus()) return this.t('continueToKarajaoikeus');
      if (!this.showMuut()) return this.t('continueToMuut');
      if (this.getFormProgress() < 100) return this.t('continue');
      return this.t('continueToGenerate');
    },

    // Check if the continue button should be disabled
    canContinue() {
      // Disable if laskutusperuste has empty fields
      if (!this.radioLaskutusmuoto) {
        return false;
      }
      if (this.radioLaskutusmuoto === 'tuntilaskutus' && !this.tuntihintaRaaka) {
        return false;
      }
      if (this.radioLaskutusmuoto === 'urakkalaskutus' && !this.urakkahintaRaaka) {
        return false;
      }

      // Allow continuing to tuntimaara in some cases
      if (!this.showTuntimaara() && this.radioLaskutusmuoto === 'tuntilaskutus') {
        return true;
      }

      // Disable if tuntimaara is shown but has empty fields
      if (this.showTuntimaara()) {
        if (!this.radioAllokaatio || !this.radioVoimassaolo) {
          return false;
        }
        if (this.radioVoimassaolo === 'eraantyy' && !this.loppupaivamaaraRaaka) {
          return false;
        }
        if (this.radioAllokaatio === 'sovittu-allokaatio' && (!this.tuntejaViikossaRaaka || !this.alkupaivamaaraRaaka)) {
          return false;
        }
      }

      // Allow continuing to tilaajan tiedot always
      if (!this.showTilaajanTiedot()) {
        return true;
      }

      // Disable if tilaajan tiedot has empty fields
      if (!this.tilaajanYritysRaaka || !this.tilaajanYtunnusRaaka || !this.tilaajanYhteyshenkiloRaaka || !this.tilaajanEmailRaaka || !this.tilaajanPuhelinRaaka) {
        return false;
      }

      // Allow continuing to toimittajan tiedot always
      if (!this.showToimittajanTiedot()) {
        return true;
      }

      // Disable if toimittajan tiedot has empty fields
      if (!this.toimittajanYritysRaaka || !this.toimittajanYtunnusRaaka || !this.toimittajanYhteyshenkiloRaaka || !this.toimittajanEmailRaaka || !this.toimittajanPuhelinRaaka) {
        return false;
      }

      // Allow continuing to projektin tiedot always
      if (!this.showProjektinTiedot()) {
        return true;
      }

      // Disable if projektin tiedot has empty fields
      if (!this.radioKonsultinRooli || !this.projektinNimiRaaka) {
        return false;
      }
      if (this.radioKonsultinRooli === 'radioConsultantRoleOther' && !this.muuRooliRaaka) {
        return false;
      }

      // Allow continuing to IPR always
      if (!this.showIPR()) {
        return true;
      }

      // Disable if IPR has empty fields
      if (!this.radioIPR) {
        return false;
      }

      // Allow continuing to sijainti always
      if (!this.showSijainti()) {
        return true;
      }

      // Disable if sijainti has empty fields
      if (!this.radioSijainti) {
        return false;
      }

      // Allow continuing to tyoajat in some cases
      if (!this.showTyoajat() && this.radioSijainti === 'etana') {
        return true;
      }

      // Disable if tyoajat is shown but has empty fields
      if (this.showTyoajat()) {
        if (!this.radioTyoajat) {
          return false;
        }
      }

      // Allow continuing to tyovalineet in some cases
      if (!this.showTyovalineet() && this.radioSijainti === 'lasna') {
        return true;
      }

      // Disable if tyovalineet is shown but has empty fields
      if (this.showTyovalineet()) {
        if (!this.radioTyovalineet) {
          return false;
        }
      }

      // Allow continuing to reference rights always
      if (!this.showReferenceRights()) {
        return true;
      }

      // Disable if reference rights has empty fields
      if (!this.radioReferenceRights) {
        return false;
      }

      // Allow continuing to karajaoikeus always
      if (!this.showKarajaoikeus()) {
        return true;
      }
      
      // Disable if karajaoikeus has empty fields
      if (!this.karajaoikeusRaaka) {
        return false;
      }

      // Allow continuing to muut always
      if (!this.showMuut()) {
        return true;
      }

      // Disable if muut has empty fields
      if (!this.matkakorvausRaaka || !this.matkustusalueRaaka || !this.maksuaikaRaaka || (this.checkboxYlityokorvaus && !this.ylityokorvausRaaka)) {
        return false;
      }

      // Special thing here. This "true" makes the continue button yellow for both "Continue to collapse 'muut' section" and "Continue to generate contract".
      return true;
    },

    previewRendered: false,
    pdfDataUri: '',
    filename: '',
    continueClicked() {
      if (this.getFormProgress() < 100) {
        // Nothing happens other than defocus, which we use to progress through the form
        return;
      }
      if (this.radioLaskutusmuoto === 'urakkalaskutus') {
        // Remind user that attachment is required for urakkalaskutus
        const attachmentReminderMessage = this.currentLanguage === 'fi' ?
          'Olet valinnut urakkamuotoisen sopimuksen. Tällöin edellytetään urakan tarkempaa määrittelyä liitteessä, joka sinun tulee muodostaa tämän sopimusgeneraattorin ulkopuolella. Sopimuksessa viitataan liitteeseen, eikä sopimus ole pätevä ilman liitettä. Lisäksi voit halutessasi kirjata liitteeseen maksuaikataulun urakan edistymisen eri vaiheista, mutta se ei ole pakollista. Painamalla "yes" vahvistat että ymmärrät liitteen merkityksen.' :
          'You have selected fixed-price contract. In this situation you need to specify the scope of the project in an attachment which you need to prepare outside this contract generator. The contract refers to the attachment, and the contract is not valid without an attachment. Additionally, you can specify a payment schedule based on the progress of the project in the attachment, though that part is not mandatory. Select "yes" to confirm that you understand the significance of the attachment.';
        if (!confirm(attachmentReminderMessage)) {
          return;
        }
      }

      // Generate PDF contents
      this.pdfDataUri = getPDF(this);

      function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
      }

      const blob = dataURItoBlob(this.pdfDataUri);
      const blobUrl = URL.createObjectURL(blob);
      document.getElementById('pdf-viewer').src = `assets/pdfjs/web/viewer.html?file=${encodeURIComponent(blobUrl)}`;
      this.previewRendered = true;
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 30);
    },

    downloadClicked() {
        // Set filename for download
        const sanitizedClientName = this.tilaajanYritysValmis.replace(/[^a-zA-Z0-9åäöÅÄÖ\s]/g, '').replace(/\s+/g, '_');
        const formattedDate = `${new Date().getDate().toString().padStart(2, '0')}.${(new Date().getMonth() + 1).toString().padStart(2, '0')}.${new Date().getFullYear()}`;
        const prefix = this.currentLanguage === 'en' ? 'ConsultingContract' : 'Konsultointisopimus';
        const filename = `${prefix}_${sanitizedClientName}_${formattedDate}.pdf`;

        // Download pdfDataUri
        const link = document.createElement('a');
        link.href = this.pdfDataUri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }
}