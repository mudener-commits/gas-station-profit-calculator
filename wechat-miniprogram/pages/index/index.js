const DENSITY = { gas: 0.73, diesel: 0.84 };
const FUEL_VAT = 0.13;
const LNG_VAT = 0.09;
const DAYS = 365;
const SUMMARY_CANVAS_HEIGHT = 1240;
const FULL_REPORT_CANVAS_HEIGHT = 3372;
const LNG_SUMMARY_EXTRA_HEIGHT = 58;
const LNG_FULL_REPORT_EXTRA_HEIGHT = 232;
const DEFAULT = {
  marginLiter: { m92: 1, m95: 1.3, diesel: 0.3 },
  marginLngKg: 0.5,
  purchaseGross: { p92: 7500, p95: 8000, diesel: 6500, lng: 4000 }
};

function initialForm() {
  return {
    vol92: 0,
    vol95: 0,
    volDiesel: 0,
    hasLng: false,
    volLng: 0,
    customMargin: false,
    margin92: 1370,
    margin95: 1781,
    marginDiesel: 357,
    marginLng: 0.5,
    customPrice: false,
    taxMode: "gross",
    purchase92: 7500,
    sale92: 8870,
    purchase95: 8000,
    sale95: 9781,
    purchaseDiesel: 6500,
    saleDiesel: 6857,
    purchaseLng: 4000,
    saleLng: 4500,
    employeeCount: 0,
    avgSalary: 0,
    salaryTotal: 0,
    hasSocial: true,
    opsCost: 0,
    giftCost: 0,
    hasLicense: true,
    licenseCost: 5000,
    adminCost: 0,
    landRent: 0,
    landRentVatRate: 0,
    depreciation: 0,
    loanAmount: 0,
    interestRate: 0,
    cardShare: 100,
    cardRate: 3,
    gasCostWeight: 3,
    dieselCostWeight: 1,
    lngCostWeight: 1,
    insuranceCost: 0,
    propertyTax: 0,
    landUseTax: 0,
    cityTaxRate: 0.07,
    incomeTaxMode: "general"
  };
}

function num(value) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function pct(value) {
  return num(value) / 100;
}

function yuanToWan(value) {
  return value / 10000;
}

function moneyWan(value) {
  const sign = value < 0 ? "-" : "";
  return `${sign}¥${Math.abs(yuanToWan(value)).toFixed(2)} 万`;
}

function plainWan(value) {
  const sign = value < 0 ? "-" : "";
  return `${sign}${Math.abs(yuanToWan(value)).toFixed(2)} 万`;
}

function percent(value) {
  if (!Number.isFinite(value)) return "0.00%";
  return `${value.toFixed(2)}%`;
}

function formatLocalTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "时间未知";
  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatChineseDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "日期未知";
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function periodMeta(periodKey = "year") {
  return periodKey === "month"
    ? { periodKey: "month", periodName: "月度", periodScale: 1 / 12 }
    : { periodKey: "year", periodName: "年度", periodScale: 1 };
}

function scaledMoneyWan(value, scale) {
  return moneyWan(value * scale);
}

function scaledPlainWan(value, scale) {
  return plainWan(value * scale);
}

function literToTonMargin(value, density) {
  return num(value) / density * 1000;
}

function tabData(tab) {
  return {
    activeTab: tab,
    showCalculator: tab === "calculator",
    showReport: tab === "report",
    showFormula: tab === "formula",
    calculatorTabClass: tab === "calculator" ? "active" : "",
    reportTabClass: tab === "report" ? "active" : "",
    formulaTabClass: tab === "formula" ? "active" : ""
  };
}

function wageModeData(mode) {
  return {
    wageMode: mode,
    isWagePeople: mode === "people",
    wagePeopleClass: mode === "people" ? "active" : "",
    wageTotalClass: mode === "total" ? "active" : ""
  };
}

function emptyResultData(dirtyText) {
  return {
    resultReady: false,
    hasWarnings: false,
    resultWarnings: [],
    profitValueClass: "profit-value",
    profitLabelDisplay: "年度净利润",
    profitDisplay: "待计算",
    profitSubDisplay: dirtyText,
    heroNetProfitLabelDisplay: "年度净利润",
    heroNetProfitDisplay: "0.00 万",
    heroEbitdaLabelDisplay: "年度净回笼资金（EBITDA-息税折旧摊销前净利润）",
    heroEbitdaDisplay: "0.00 万",
    revenueDisplay: "0.00 万",
    costDisplay: "0.00 万",
    taxDisplay: "0.00 万",
    reportProfitLabelDisplay: "报告口径年度净利润",
    reportProfitDisplay: "待计算",
    reportEbitdaHeroLabelDisplay: "报告口径年度净回笼资金（EBITDA-息税折旧摊销前净利润）",
    reportEbitdaHeroDisplay: "0.00 万",
    reportStatusDisplay: "请先在利润计算器页点击“按月度计算”或“按年度计算”。",
    reportRevenueLabelDisplay: "年度测算收入",
    reportRevenueDisplay: "0.00 万",
    reportCostLabelDisplay: "年度成本合计",
    reportCostDisplay: "0.00 万",
    reportTaxLabelDisplay: "年度税费合计",
    reportTaxDisplay: "0.00 万",
    reportTonsLabelDisplay: "年度油气销量",
    reportTonsDisplay: "0.00 吨",
    ebitdaDisplay: "0.00 万",
    profitRateDisplay: "0.00%",
    costRateDisplay: "0.00%",
    taxRateDisplay: "0.00%",
    fuelMarginRateDisplay: "0.00%",
    gasExpenseDisplay: "0 元/吨 / 0.00 元/升",
    dieselExpenseDisplay: "0 元/吨 / 0.00 元/升",
    lngExpenseDisplay: "0 元/吨 / 0.00 元/公斤",
    gasRentDisplay: "0 元/吨 / 0.00 元/升",
    dieselRentDisplay: "0 元/吨 / 0.00 元/升",
    lngRentDisplay: "0 元/吨 / 0.00 元/公斤",
    costSplitRatioDisplay: "汽油:柴油 = 3:1",
    gasolineVolumeMarginDisplay: "0.00 吨 / 0.00%",
    dieselVolumeMarginDisplay: "0.00 吨 / 0.00%",
    lngVolumeMarginDisplay: "0.00 吨 / 0.00%",
    gasolineVolumeMarginLabel: "汽油年度销量 / 毛利率",
    dieselVolumeMarginLabel: "柴油年度销量 / 毛利率",
    lngVolumeMarginLabel: "LNG 年度销量 / 毛利率",
    shareRevenueLabelDisplay: "年度测算收入",
    shareRevenueDisplay: "0.00 万",
    shareCostLabelDisplay: "年度成本合计",
    shareCostDisplay: "0.00 万",
    shareTaxLabelDisplay: "年度税费合计",
    shareTaxDisplay: "0.00 万",
    shareProfitLabelDisplay: "年度净利润",
    shareProfitDisplay: "0.00 万",
    shareEbitdaLabelDisplay: "年度净回笼资金（EBITDA）",
    shareEbitdaDisplay: "0.00 万",
    shareVol92Display: "0 升/天",
    shareVol95Display: "0 升/天",
    shareVolDieselDisplay: "0 升/天",
    shareVolLngDisplay: "0 公斤/天",
    resultHasLng: false,
    resultCostLines: [],
    resultActions: []
  };
}

function filledResultData(result) {
  return {
    resultReady: true,
    hasWarnings: result.warnings.length > 0,
    resultWarnings: result.warnings,
    profitValueClass: result.profit < 0 ? "profit-value loss" : "profit-value",
    profitLabelDisplay: `${result.periodName}净利润`,
    profitDisplay: result.profitText,
    profitSubDisplay: result.timeText,
    heroNetProfitLabelDisplay: `${result.periodName}净利润`,
    heroNetProfitDisplay: result.profitPlainText,
    heroEbitdaLabelDisplay: `${result.periodName}净回笼资金（EBITDA-息税折旧摊销前净利润）`,
    heroEbitdaDisplay: result.ebitdaText,
    revenueDisplay: result.revenueText,
    costDisplay: result.costText,
    taxDisplay: result.taxText,
    reportProfitLabelDisplay: `报告口径${result.periodName}净利润`,
    reportProfitDisplay: result.profitText,
    reportEbitdaHeroLabelDisplay: `报告口径${result.periodName}净回笼资金（EBITDA-息税折旧摊销前净利润）`,
    reportEbitdaHeroDisplay: result.ebitdaText,
    reportStatusDisplay: result.reportStatus,
    reportRevenueLabelDisplay: `${result.periodName}测算收入`,
    reportRevenueDisplay: result.revenueTextFull,
    reportCostLabelDisplay: `${result.periodName}成本合计`,
    reportCostDisplay: result.costTextFull,
    reportTaxLabelDisplay: `${result.periodName}税费合计`,
    reportTaxDisplay: result.taxTextFull,
    reportTonsLabelDisplay: `${result.periodName}油气销量`,
    reportTonsDisplay: result.totalTonsText,
    ebitdaDisplay: result.ebitdaText,
    profitRateDisplay: result.profitRateText,
    costRateDisplay: result.costRateText,
    taxRateDisplay: result.taxRateText,
    fuelMarginRateDisplay: result.fuelMarginRateText,
    gasExpenseDisplay: result.gasExpenseText,
    dieselExpenseDisplay: result.dieselExpenseText,
    lngExpenseDisplay: result.lngExpenseText,
    gasRentDisplay: result.gasRentText,
    dieselRentDisplay: result.dieselRentText,
    lngRentDisplay: result.lngRentText,
    costSplitRatioDisplay: result.splitRatioLabel,
    gasolineVolumeMarginDisplay: result.gasolineVolumeMarginText,
    dieselVolumeMarginDisplay: result.dieselVolumeMarginText,
    lngVolumeMarginDisplay: result.lngVolumeMarginText,
    gasolineVolumeMarginLabel: `汽油${result.periodName}销量 / 毛利率`,
    dieselVolumeMarginLabel: `柴油${result.periodName}销量 / 毛利率`,
    lngVolumeMarginLabel: `LNG ${result.periodName}销量 / 毛利率`,
    shareRevenueLabelDisplay: `${result.periodName}测算收入`,
    shareRevenueDisplay: result.revenueTextFull,
    shareCostLabelDisplay: `${result.periodName}成本合计`,
    shareCostDisplay: result.costTextFull,
    shareTaxLabelDisplay: `${result.periodName}税费合计`,
    shareTaxDisplay: result.taxTextFull,
    shareProfitLabelDisplay: `${result.periodName}净利润`,
    shareProfitDisplay: result.profitText,
    shareEbitdaLabelDisplay: `${result.periodName}净回笼资金（EBITDA）`,
    shareEbitdaDisplay: result.ebitdaText,
    shareVol92Display: result.vol92DailyText,
    shareVol95Display: result.vol95DailyText,
    shareVolDieselDisplay: result.volDieselDailyText,
    shareVolLngDisplay: result.volLngDailyText,
    resultHasLng: result.hasLng,
    resultCostLines: result.costLines,
    resultActions: result.actions.map((item, index) => ({ ...item, num: index + 1 }))
  };
}

Page({
  data: {
    ...tabData("calculator"),
    form: initialForm(),
    ...wageModeData("people"),
    result: null,
    dirtyText: "填写完成后点击“按月度计算”或“按年度计算”，系统会先检查漏填项和异常数据。",
    ...emptyResultData("填写完成后点击“按月度计算”或“按年度计算”，系统会先检查漏填项和异常数据。"),
    reportStationName: "",
    reportStationNameDisplay: "请在下方填写加油（加气）站名称",
    taxModeIndex: 0,
    cityTaxIndex: 0,
    incomeTaxIndex: 0,
    landRentVatIndex: 0,
    taxModeLabel: "含税",
    cityTaxLabel: "市区 7%",
    incomeTaxLabel: "一般企业 25%",
    landRentVatLabel: "无可抵扣专票",
    taxModes: [
      { label: "含税", value: "gross" },
      { label: "不含税", value: "net" }
    ],
    cityTaxRates: [
      { label: "市区 7%", value: 0.07 },
      { label: "县城/镇 5%", value: 0.05 },
      { label: "其他 1%", value: 0.01 }
    ],
    incomeTaxModes: [
      { label: "一般企业 25%", value: "general" },
      { label: "小型微利企业优惠测算（需符合条件）", value: "small" }
    ],
    landRentVatRates: [
      { label: "无可抵扣专票", value: 0 },
      { label: "5%专票（出租方简易计税）", value: 0.05 },
      { label: "9%专票（一般计税）", value: 0.09 }
    ],
    demandTypes: ["请选择", "出售", "出租", "整体转让（转租）", "合作经营", "想先了解估值"],
    stationStatuses: ["请选择", "正在营业（自营）", "正在营业（租赁）", "新建未运营", "其他"],
    stationTypes: ["请选择", "城区站", "国省道站", "乡镇站", "其他"],
    landCertOptions: ["请选择", "有", "没有", "不确定", "不方便透露"],
    leadDemandIndex: 0,
    leadStatusIndex: 0,
    leadTypeIndex: 0,
    leadLandCertIndex: 0,
    leadDemandLabel: "请选择",
    leadStatusLabel: "请选择",
    leadTypeLabel: "请选择",
    leadLandCertLabel: "请选择",
    leadConsent: false,
    assetLeadRecords: [],
    hasAssetLeadRecords: false,
    lead: {
      assetContactName: "",
      assetContactMethod: "",
      assetRegion: ""
    },
    message: {
      messageName: "",
      messageContact: "",
      messageContent: ""
    }
  },

  onLoad() {
    this.loadAssetLeadRecords();
  },

  switchTab(event) {
    this.setData(tabData(event.currentTarget.dataset.tab), () => {
      wx.pageScrollTo({ scrollTop: 0, duration: 180 });
    });
  },

  markDirty() {
    if (!this.data.result) return;
    const dirtyText = "数据已修改，请重新点击“按月度计算”或“按年度计算”并确认后生成新结果。";
    this.setData({
      result: null,
      dirtyText,
      ...emptyResultData(dirtyText)
    });
  },

  onNumberInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: event.detail.value });
    this.markDirty();
  },

  onSwitchChange(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: event.detail.value });
    this.markDirty();
  },

  setWageMode(event) {
    this.setData(wageModeData(event.currentTarget.dataset.mode));
    this.markDirty();
  },

  onTaxModeChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      taxModeIndex: index,
      taxModeLabel: this.data.taxModes[index].label,
      "form.taxMode": this.data.taxModes[index].value
    });
    this.markDirty();
  },

  onCityTaxChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      cityTaxIndex: index,
      cityTaxLabel: this.data.cityTaxRates[index].label,
      "form.cityTaxRate": this.data.cityTaxRates[index].value
    });
    this.markDirty();
  },

  onIncomeTaxChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      incomeTaxIndex: index,
      incomeTaxLabel: this.data.incomeTaxModes[index].label,
      "form.incomeTaxMode": this.data.incomeTaxModes[index].value
    });
    this.markDirty();
  },

  onLandRentVatChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      landRentVatIndex: index,
      landRentVatLabel: this.data.landRentVatRates[index].label,
      "form.landRentVatRate": this.data.landRentVatRates[index].value
    });
    this.markDirty();
  },

  getMarginsTon(form) {
    if (!form.customMargin) {
      return {
        m92: literToTonMargin(DEFAULT.marginLiter.m92, DENSITY.gas),
        m95: literToTonMargin(DEFAULT.marginLiter.m95, DENSITY.gas),
        diesel: literToTonMargin(DEFAULT.marginLiter.diesel, DENSITY.diesel),
        lng: DEFAULT.marginLngKg * 1000
      };
    }
    return {
      m92: num(form.margin92),
      m95: num(form.margin95),
      diesel: num(form.marginDiesel),
      lng: num(form.marginLng) * 1000
    };
  },

  getPrices(form, margins) {
    const custom = form.customPrice;
    const gross = custom ? form.taxMode === "gross" : true;
    const raw = custom
      ? {
          p92: num(form.purchase92),
          s92: num(form.sale92),
          p95: num(form.purchase95),
          s95: num(form.sale95),
          pd: num(form.purchaseDiesel),
          sd: num(form.saleDiesel),
          plng: num(form.purchaseLng),
          slng: num(form.saleLng)
        }
      : {
          p92: DEFAULT.purchaseGross.p92,
          s92: DEFAULT.purchaseGross.p92 + margins.m92,
          p95: DEFAULT.purchaseGross.p95,
          s95: DEFAULT.purchaseGross.p95 + margins.m95,
          pd: DEFAULT.purchaseGross.diesel,
          sd: DEFAULT.purchaseGross.diesel + margins.diesel,
          plng: DEFAULT.purchaseGross.lng,
          slng: DEFAULT.purchaseGross.lng + margins.lng
        };

    const fuelDivisor = gross ? 1 + FUEL_VAT : 1;
    const lngDivisor = gross ? 1 + LNG_VAT : 1;
    return {
      gross,
      raw,
      net: {
        p92: raw.p92 / fuelDivisor,
        s92: raw.s92 / fuelDivisor,
        p95: raw.p95 / fuelDivisor,
        s95: raw.s95 / fuelDivisor,
        pd: raw.pd / fuelDivisor,
        sd: raw.sd / fuelDivisor,
        plng: raw.plng / lngDivisor,
        slng: raw.slng / lngDivisor
      }
    };
  },

  incomeTax(taxable, form) {
    if (taxable <= 0) return 0;
    return form.incomeTaxMode === "small" ? taxable * 0.05 : taxable * 0.25;
  },

  calculateRaw() {
    const form = this.data.form;
    const hasLng = Boolean(form.hasLng);
    const liters = {
      l92: num(form.vol92) * DAYS,
      l95: num(form.vol95) * DAYS,
      ld: num(form.volDiesel) * DAYS
    };
    const tons = {
      t92: liters.l92 * DENSITY.gas / 1000,
      t95: liters.l95 * DENSITY.gas / 1000,
      td: liters.ld * DENSITY.diesel / 1000,
      tlng: hasLng ? num(form.volLng) * DAYS / 1000 : 0
    };
    const margins = this.getMarginsTon(form);
    const prices = this.getPrices(form, margins);

    const grossFuelSales = tons.t92 * prices.raw.s92 + tons.t95 * prices.raw.s95 + tons.td * prices.raw.sd + tons.tlng * prices.raw.slng;
    const revenue = {
      r92: tons.t92 * prices.net.s92,
      r95: tons.t95 * prices.net.s95,
      rd: tons.td * prices.net.sd,
      rlng: tons.tlng * prices.net.slng
    };
    revenue.fuel = revenue.r92 + revenue.r95 + revenue.rd;
    revenue.lng = revenue.rlng;
    revenue.total = revenue.fuel + revenue.lng;

    const oilPurchaseCost = tons.t92 * prices.net.p92 + tons.t95 * prices.net.p95 + tons.td * prices.net.pd;
    const lngPurchaseCost = tons.tlng * prices.net.plng;
    const purchaseCost = oilPurchaseCost + lngPurchaseCost;
    const monthlyWage = this.data.wageMode === "people" ? num(form.employeeCount) * num(form.avgSalary) : num(form.salaryTotal);
    const wage = monthlyWage * 12;
    const social = form.hasSocial ? wage * 0.32 : 0;
    const ops = num(form.opsCost) * 12;
    const gift = num(form.giftCost) * 12;
    const license = form.hasLicense ? num(form.licenseCost) : 0;
    const admin = num(form.adminCost);
    const landRentGross = num(form.landRent);
    const landRentVatRate = num(form.landRentVatRate);
    const landRent = landRentVatRate > 0 ? landRentGross / (1 + landRentVatRate) : landRentGross;
    const landRentInputVat = landRentGross - landRent;
    const depreciation = num(form.depreciation);
    const loanInterest = num(form.loanAmount) * pct(form.interestRate);
    const cardFee = grossFuelSales * pct(Math.min(num(form.cardShare), 100)) * (num(form.cardRate) / 1000);
    const complianceAdmin = license + admin;
    const financeCost = loanInterest + cardFee;
    const insurance = num(form.insuranceCost);
    const propertyTax = num(form.propertyTax);
    const landUseTax = num(form.landUseTax);
    const costTotal = purchaseCost + wage + social + ops + gift + complianceAdmin + landRent + depreciation + financeCost + insurance + propertyTax + landUseTax;

    const outputVat = revenue.fuel * FUEL_VAT + revenue.lng * LNG_VAT;
    const purchaseInputVat = oilPurchaseCost * FUEL_VAT + lngPurchaseCost * LNG_VAT;
    const inputVat = purchaseInputVat + landRentInputVat;
    const vatPayable = Math.max(0, outputVat - inputVat);
    const retainedVat = Math.max(0, inputVat - outputVat);
    const cityTax = vatPayable * num(form.cityTaxRate);
    const edu = vatPayable * 0.03;
    const localEdu = vatPayable * 0.02;
    const stamp = revenue.total * 0.0003;
    const taxableIncome = revenue.total - costTotal - cityTax - edu - localEdu - stamp;
    const corpTax = this.incomeTax(taxableIncome, form);
    const taxTotal = vatPayable + cityTax + edu + localEdu + stamp + corpTax;
    const profit = revenue.total - costTotal - taxTotal;

    const warnings = [];
    if (num(form.vol92) + num(form.vol95) + num(form.volDiesel) + (hasLng ? num(form.volLng) : 0) <= 0) warnings.push("至少填写一个油气品类的销量后，结果才有经营意义。");
    if (prices.raw.s92 < prices.raw.p92 && tons.t92 > 0) warnings.push("92# 当前为负毛利。");
    if (prices.raw.s95 < prices.raw.p95 && tons.t95 > 0) warnings.push("95# 当前为负毛利。");
    if (prices.raw.sd < prices.raw.pd && tons.td > 0) warnings.push("柴油当前为负毛利。");
    if (prices.raw.slng < prices.raw.plng && tons.tlng > 0) warnings.push("LNG 当前为负毛利。");
    if (retainedVat > 0) warnings.push(`进项留抵估算：${moneyWan(retainedVat)}。`);
    if (taxableIncome <= 0) warnings.push("应纳税所得额小于等于 0，企业所得税按 0 测算。");
    if (form.incomeTaxMode === "small") warnings.push("当前使用小型微利企业优惠测算口径。");

    return {
      time: new Date(),
      hasLng,
      tons,
      margins,
      prices,
      grossFuelSales,
      revenue,
      costs: {
        purchaseCost,
        oilPurchaseCost,
        lngPurchaseCost,
        wage,
        social,
        ops,
        gift,
        complianceAdmin,
        landRent,
        landRentGross,
        depreciation,
        loanInterest,
        cardFee,
        financeCost,
        insurance,
        propertyTax,
        landUseTax,
        total: costTotal
      },
      taxes: {
        outputVat,
        purchaseInputVat,
        landRentInputVat,
        inputVat,
        vatPayable,
        retainedVat,
        cityTax,
        edu,
        localEdu,
        stamp,
        taxableIncome,
        corpTax,
        total: taxTotal
      },
      profit,
      warnings
    };
  },

  oilRows(result) {
    const form = this.data.form;
    const rows = [
      { name: "92#", daily: num(form.vol92), tons: result.tons.t92, density: DENSITY.gas, unit: "升", rawPurchase: result.prices.raw.p92, rawSale: result.prices.raw.s92, netPurchase: result.prices.net.p92, netSale: result.prices.net.s92 },
      { name: "95#", daily: num(form.vol95), tons: result.tons.t95, density: DENSITY.gas, unit: "升", rawPurchase: result.prices.raw.p95, rawSale: result.prices.raw.s95, netPurchase: result.prices.net.p95, netSale: result.prices.net.s95 },
      { name: "柴油", daily: num(form.volDiesel), tons: result.tons.td, density: DENSITY.diesel, unit: "升", rawPurchase: result.prices.raw.pd, rawSale: result.prices.raw.sd, netPurchase: result.prices.net.pd, netSale: result.prices.net.sd }
    ];
    if (result.hasLng) rows.push({ name: "LNG", daily: num(form.volLng), tons: result.tons.tlng, density: 1, unit: "公斤", rawPurchase: result.prices.raw.plng, rawSale: result.prices.raw.slng, netPurchase: result.prices.net.plng, netSale: result.prices.net.slng });
    return rows;
  },

  getReviewIssues(result) {
    const form = this.data.form;
    const blockers = [];
    const warnings = [];
    const totalDaily = num(form.vol92) + num(form.vol95) + num(form.volDiesel) + (result.hasLng ? num(form.volLng) : 0);
    const rows = this.oilRows(result);

    if (totalDaily <= 0) blockers.push("销量数据未填写：至少需要填写一个油气品类的日均销量。");
    if (result.hasLng && num(form.volLng) <= 0) blockers.push("已勾选 LNG 加气业务，请填写 LNG 日均销量；如本站不经营 LNG，请取消勾选。");
    if (num(form.cardShare) > 100) blockers.push("刷卡/支付占比不能超过 100%，请修改后再计算。");
    if (num(form.cardShare) < 0 || num(form.cardRate) < 0) blockers.push("刷卡/支付占比和手续费率不能填写为负数。");
    if (num(form.gasCostWeight) <= 0 || num(form.dieselCostWeight) <= 0 || (result.hasLng && num(form.lngCostWeight) <= 0)) blockers.push("各油气品类的共同费用分摊系数必须大于 0。");

    if (form.customPrice) {
      rows.forEach((item) => {
        if (item.daily > 0 && (item.rawPurchase <= 0 || item.rawSale <= 0)) {
          blockers.push(`${item.name} 已填写销量，但自定义采购价或零售价为空，请补充。`);
        }
      });
    }

    const monthlyWage = this.data.wageMode === "people" ? num(form.employeeCount) * num(form.avgSalary) : num(form.salaryTotal);
    if (totalDaily > 0 && monthlyWage <= 0) warnings.push("人员工资为 0，请确认是否漏填人员成本。");
    if (totalDaily > 0 && num(form.opsCost) <= 0) warnings.push("月综合运营费用为 0，请确认水电、维修、办公、杂费等是否需要计入。");
    if (num(form.loanAmount) > 0 && num(form.interestRate) <= 0) warnings.push("已填写贷款金额，但利率为 0，请确认贷款利息是否漏填。");
    if (num(form.loanAmount) <= 0 && num(form.interestRate) > 0) warnings.push("已填写利率，但贷款金额为 0，请确认资金成本是否需要计入。");
    if (num(form.landRent) <= 0 && num(form.landRentVatRate) > 0) warnings.push("已选择租金专票抵扣方式，但土地/油站租金为 0，请确认是否需要填写租金。");

    rows.forEach((item) => {
      if (item.daily <= 0) return;
      const marginTon = item.rawSale - item.rawPurchase;
      const marginUnitValue = item.unit === "公斤" ? marginTon / 1000 : marginTon * item.density / 1000;
      const marginRate = item.netSale > 0 ? (item.netSale - item.netPurchase) / item.netSale * 100 : 0;
      if (marginUnitValue > 3) warnings.push(`${item.name} 毛利约 ${marginUnitValue.toFixed(2)} 元/${item.unit}，超过 3 元/${item.unit}，请核对采购价、销售价或毛利口径。`);
      if (marginRate > 30) warnings.push(`${item.name} 毛利率约 ${marginRate.toFixed(1)}%，超过 30%，请确认数据是否合理。`);
      if (marginTon < 0) warnings.push(`${item.name} 当前为负毛利，请确认是否为真实促销或价格录入错误。`);
    });

    const totalTons = rows.reduce((sum, item) => sum + item.tons, 0);
    if (totalTons > 0) {
      const managementCost = Math.max(0, result.costs.total - result.costs.purchaseCost - result.costs.landRent);
      const managementPerTon = managementCost / totalTons;
      if (managementPerTon < 100) warnings.push(`管理类成本约 ${managementPerTon.toFixed(0)} 元/吨，低于 100 元/吨，请确认人工、运营、折旧、保险等费用是否漏填。`);
      if (managementPerTon > 1000) warnings.push(`管理类成本约 ${managementPerTon.toFixed(0)} 元/吨，超过 1000 元/吨，请核对固定成本、资金成本或销量是否录入偏差。`);
    }

    return { blockers, warnings };
  },

  formatResult(raw, periodKey = "year") {
    const period = periodMeta(periodKey);
    const scale = period.periodScale;
    const totalTons = raw.tons.t92 + raw.tons.t95 + raw.tons.td + raw.tons.tlng;
    const revenueBase = Math.max(raw.revenue.total, 1);
    const profitRate = raw.profit / revenueBase * 100;
    const costRate = raw.costs.total / revenueBase * 100;
    const taxRate = raw.taxes.total / revenueBase * 100;
    const fuelGrossMargin = raw.revenue.total - raw.costs.purchaseCost;
    const fuelMarginRate = fuelGrossMargin / Math.max(raw.revenue.total, 1) * 100;
    const gasolineRevenue = raw.revenue.r92 + raw.revenue.r95;
    const dieselRevenue = raw.revenue.rd;
    const lngRevenue = raw.revenue.rlng;
    const gasolinePurchaseCost = raw.tons.t92 * raw.prices.net.p92 + raw.tons.t95 * raw.prices.net.p95;
    const dieselPurchaseCost = raw.tons.td * raw.prices.net.pd;
    const lngPurchaseCost = raw.tons.tlng * raw.prices.net.plng;
    const gasolineMarginRate = (gasolineRevenue - gasolinePurchaseCost) / Math.max(gasolineRevenue, 1) * 100;
    const dieselMarginRate = (dieselRevenue - dieselPurchaseCost) / Math.max(dieselRevenue, 1) * 100;
    const lngMarginRate = raw.hasLng ? (lngRevenue - lngPurchaseCost) / Math.max(lngRevenue, 1) * 100 : 0;
    const ebitda = raw.profit + raw.taxes.corpTax + raw.costs.loanInterest + raw.costs.depreciation;
    const expenseBase = Math.max(0, raw.costs.total - raw.costs.purchaseCost - raw.costs.landRent);
    const rentExpenseBase = Math.max(0, raw.costs.landRent);
    const gasolineLiters = (num(this.data.form.vol92) + num(this.data.form.vol95)) * DAYS;
    const dieselLiters = num(this.data.form.volDiesel) * DAYS;
    const gasolineTons = raw.tons.t92 + raw.tons.t95;
    const dieselTons = raw.tons.td;
    const lngTons = raw.tons.tlng;
    const lngKg = lngTons * 1000;
    const gasolineWeightFactor = Math.max(num(this.data.form.gasCostWeight), 0);
    const dieselWeightFactor = Math.max(num(this.data.form.dieselCostWeight), 0);
    const lngWeightFactor = raw.hasLng ? Math.max(num(this.data.form.lngCostWeight), 0) : 0;
    const gasolineWeightedTons = gasolineTons * gasolineWeightFactor;
    const dieselWeightedTons = dieselTons * dieselWeightFactor;
    const lngWeightedTons = lngTons * lngWeightFactor;
    const totalWeightedTons = gasolineWeightedTons + dieselWeightedTons + lngWeightedTons;
    const gasolineExpense = totalWeightedTons > 0 ? expenseBase * gasolineWeightedTons / totalWeightedTons : 0;
    const dieselExpense = totalWeightedTons > 0 ? expenseBase * dieselWeightedTons / totalWeightedTons : 0;
    const lngExpense = totalWeightedTons > 0 ? expenseBase * lngWeightedTons / totalWeightedTons : 0;
    const gasolineRent = totalWeightedTons > 0 ? rentExpenseBase * gasolineWeightedTons / totalWeightedTons : 0;
    const dieselRent = totalWeightedTons > 0 ? rentExpenseBase * dieselWeightedTons / totalWeightedTons : 0;
    const lngRent = totalWeightedTons > 0 ? rentExpenseBase * lngWeightedTons / totalWeightedTons : 0;
    const gasolineExpensePerTon = gasolineTons > 0 ? gasolineExpense / gasolineTons : 0;
    const dieselExpensePerTon = dieselTons > 0 ? dieselExpense / dieselTons : 0;
    const lngExpensePerTon = lngTons > 0 ? lngExpense / lngTons : 0;
    const gasolineExpensePerLiter = gasolineLiters > 0 ? gasolineExpense / gasolineLiters : 0;
    const dieselExpensePerLiter = dieselLiters > 0 ? dieselExpense / dieselLiters : 0;
    const lngExpensePerKg = lngKg > 0 ? lngExpense / lngKg : 0;
    const gasolineRentPerTon = gasolineTons > 0 ? gasolineRent / gasolineTons : 0;
    const dieselRentPerTon = dieselTons > 0 ? dieselRent / dieselTons : 0;
    const lngRentPerTon = lngTons > 0 ? lngRent / lngTons : 0;
    const gasolineRentPerLiter = gasolineLiters > 0 ? gasolineRent / gasolineLiters : 0;
    const dieselRentPerLiter = dieselLiters > 0 ? dieselRent / dieselLiters : 0;
    const lngRentPerKg = lngKg > 0 ? lngRent / lngKg : 0;
    const splitRatioLabel = raw.hasLng
      ? `汽油:柴油:LNG = ${gasolineWeightFactor || 0}:${dieselWeightFactor || 0}:${lngWeightFactor || 0}`
      : `汽油:柴油 = ${gasolineWeightFactor || 0}:${dieselWeightFactor || 0}`;
    const actions = [];

    if (profitRate < 5) {
      actions.push({ title: "优先看毛利和费用", body: "净利率偏低时，先核对实际采购价、零售价、折扣活动和大额固定成本。" });
    } else {
      actions.push({ title: "利润状态较稳", body: "当前测算净利率尚可，建议保留精算价格口径，便于后续月度复盘。" });
    }
    if (costRate > 88) {
      actions.push({ title: "压降成本压力", body: "成本占比较高，重点看租金、人工、资金利息和支付手续费。" });
    } else {
      actions.push({ title: "成本结构可控", body: "成本占比未明显异常，可继续细化固定成本和支付通道成本。" });
    }
    if (raw.taxes.retainedVat > 0) {
      actions.push({ title: "关注进项留抵", body: "当前出现进项留抵估算，可结合实际申报周期单独核对。" });
    } else {
      actions.push({ title: "税费口径清晰", body: "当前税费为正向测算，可继续核对城建税所在地和所得税优惠条件。" });
    }

    return {
      ...raw,
      ...period,
      ebitda,
      gasolineExpensePerTon,
      dieselExpensePerTon,
      lngExpensePerTon,
      gasolineExpensePerLiter,
      dieselExpensePerLiter,
      lngExpensePerKg,
      gasolineRentPerTon,
      dieselRentPerTon,
      lngRentPerTon,
      gasolineRentPerLiter,
      dieselRentPerLiter,
      lngRentPerKg,
      gasolineMarginRate,
      dieselMarginRate,
      lngMarginRate,
      gasolineTons,
      dieselTons,
      lngTons,
      splitRatioLabel,
      profitText: scaledMoneyWan(raw.profit, scale),
      profitPlainText: scaledPlainWan(raw.profit, scale),
      revenueText: scaledPlainWan(raw.revenue.total, scale),
      costText: scaledPlainWan(raw.costs.total, scale),
      taxText: scaledPlainWan(raw.taxes.total, scale),
      revenueTextFull: scaledPlainWan(raw.revenue.total, scale),
      costTextFull: scaledPlainWan(raw.costs.total, scale),
      taxTextFull: scaledPlainWan(raw.taxes.total, scale),
      ebitdaText: scaledPlainWan(ebitda, scale),
      timeText: `${period.periodName}口径 · 测算时间：${formatLocalTime(raw.time)}`,
      reportStatus: `当前口径：${this.data.form.incomeTaxMode === "small" ? "小型微利企业优惠测算" : "一般企业 25% 测算"}；${period.periodName}展示结果仅作经营测算。`,
      totalTonsText: `${(totalTons * scale).toFixed(2)} 吨`,
      profitRateText: percent(profitRate),
      costRateText: percent(costRate),
      taxRateText: percent(taxRate),
      fuelMarginRateText: percent(fuelMarginRate),
      gasExpenseText: `${gasolineExpensePerTon.toFixed(0)} 元/吨 / ${gasolineExpensePerLiter.toFixed(2)} 元/升`,
      dieselExpenseText: `${dieselExpensePerTon.toFixed(0)} 元/吨 / ${dieselExpensePerLiter.toFixed(2)} 元/升`,
      lngExpenseText: `${lngExpensePerTon.toFixed(0)} 元/吨 / ${lngExpensePerKg.toFixed(2)} 元/公斤`,
      gasRentText: `${gasolineRentPerTon.toFixed(0)} 元/吨 / ${gasolineRentPerLiter.toFixed(2)} 元/升`,
      dieselRentText: `${dieselRentPerTon.toFixed(0)} 元/吨 / ${dieselRentPerLiter.toFixed(2)} 元/升`,
      lngRentText: `${lngRentPerTon.toFixed(0)} 元/吨 / ${lngRentPerKg.toFixed(2)} 元/公斤`,
      gasolineVolumeMarginText: `${(gasolineTons * scale).toFixed(2)} 吨 / ${percent(gasolineMarginRate)}`,
      dieselVolumeMarginText: `${(dieselTons * scale).toFixed(2)} 吨 / ${percent(dieselMarginRate)}`,
      lngVolumeMarginText: `${(lngTons * scale).toFixed(2)} 吨 / ${percent(lngMarginRate)}`,
      vol92DailyText: `${num(this.data.form.vol92).toLocaleString("zh-CN")} 升/天`,
      vol95DailyText: `${num(this.data.form.vol95).toLocaleString("zh-CN")} 升/天`,
      volDieselDailyText: `${num(this.data.form.volDiesel).toLocaleString("zh-CN")} 升/天`,
      volLngDailyText: `${num(this.data.form.volLng).toLocaleString("zh-CN")} 公斤/天`,
      costLines: [
        { label: "油气采购成本", value: scaledMoneyWan(raw.costs.purchaseCost, scale) },
        { label: "人工及社保", value: scaledMoneyWan(raw.costs.wage + raw.costs.social, scale) },
        { label: "运营及赠品", value: scaledMoneyWan(raw.costs.ops + raw.costs.gift, scale) },
        { label: "证照及行政合规支出", value: scaledMoneyWan(raw.costs.complianceAdmin, scale) },
        { label: "土地/油站租金", value: scaledMoneyWan(raw.costs.landRent, scale), tone: "rent" },
        { label: "资产折旧", value: scaledMoneyWan(raw.costs.depreciation, scale) },
        { label: "财务成本", value: scaledMoneyWan(raw.costs.financeCost, scale) },
        { label: "保险及税费类成本", value: scaledMoneyWan(raw.costs.insurance + raw.costs.propertyTax + raw.costs.landUseTax, scale) }
      ],
      actions
    };
  },

  startCalculation(event) {
    const periodKey = event && event.currentTarget && event.currentTarget.dataset.period ? event.currentTarget.dataset.period : "year";
    const raw = this.calculateRaw();
    const review = this.getReviewIssues(raw);
    const issues = review.blockers.concat(review.warnings);

    if (review.blockers.length) {
      wx.showModal({
        title: "请先补充信息",
        content: review.blockers.join("\n"),
        showCancel: false,
        confirmText: "返回修改"
      });
      return;
    }

    wx.showModal({
      title: "核算前确认",
      content: issues.length ? issues.join("\n") : "没有发现漏填项或明显异常数据，可以生成结果。",
      cancelText: "返回修改",
      confirmText: "生成结果",
      success: (res) => {
        if (!res.confirm) return;
        const result = this.formatResult(raw, periodKey);
        this.setData({
          result,
          ...filledResultData(result),
          ...tabData("calculator")
        });
      }
    });
  },

  fillSample() {
    const includeLng = Boolean(this.data.form.hasLng);
    const form = {
      ...this.data.form,
      vol92: 5000,
      vol95: 2000,
      volDiesel: 3000,
      hasLng: includeLng,
      volLng: includeLng ? 15000 : 0,
      employeeCount: 5,
      avgSalary: 6000,
      opsCost: 8000,
      giftCost: 2000,
      licenseCost: 8000,
      landRent: 120000,
      depreciation: 80000,
      loanAmount: 1000000,
      interestRate: 5,
      cardShare: 100,
      cardRate: 3,
      gasCostWeight: 3,
      dieselCostWeight: 1,
      lngCostWeight: 1,
      insuranceCost: 20000,
      propertyTax: 0,
      landUseTax: 10000
    };
    const sampleText = includeLng
      ? "示例数据已填入，LNG 日均销量为 15 吨，点击“按月度计算”或“按年度计算”查看测算结果。"
      : "示例数据已填入，点击“按月度计算”或“按年度计算”查看测算结果。";
    this.setData({
      form,
      result: null,
      dirtyText: sampleText,
      ...emptyResultData(sampleText)
    });
  },

  resetForm() {
    this.setData({
      form: initialForm(),
      ...wageModeData("people"),
      taxModeIndex: 0,
      cityTaxIndex: 0,
      incomeTaxIndex: 0,
      taxModeLabel: "含税",
      cityTaxLabel: "市区 7%",
      incomeTaxLabel: "一般企业 25%",
      result: null,
      dirtyText: "已清空输入，请填写数据后点击“按月度计算”或“按年度计算”。",
      ...emptyResultData("已清空输入，请填写数据后点击“按月度计算”或“按年度计算”。")
    });
  },

  onReportStationNameInput(event) {
    const value = event.detail.value;
    this.setData({
      reportStationName: value,
      reportStationNameDisplay: value.trim() || "请在下方填写加油（加气）站名称"
    });
  },

  canvasText(ctx, text, x, y, maxWidth) {
    ctx.fillText(String(text), x, y, maxWidth);
  },

  drawRoundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  },

  wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
    const chars = String(text).split("");
    const lines = [];
    let lineText = "";
    chars.forEach((char) => {
      const testLine = lineText + char;
      if (ctx.measureText(testLine).width > maxWidth && lineText) {
        lines.push(lineText);
        lineText = char;
      } else {
        lineText = testLine;
      }
    });
    if (lineText) lines.push(lineText);
    lines.slice(0, maxLines).forEach((lineItem, index) => {
      ctx.fillText(lineItem, x, y + index * lineHeight, maxWidth);
    });
    return y + Math.min(lines.length, maxLines) * lineHeight;
  },

  drawReportRow(ctx, label, value, x, y, w, highlight = false, tone = "") {
    const isRent = tone === "rent";
    if (highlight) {
      this.drawRoundRect(ctx, x - 10, y - 34, w + 20, 58, 10);
      ctx.fillStyle = "#fff0f0";
      ctx.fill();
    }
    if (isRent) {
      this.drawRoundRect(ctx, x - 10, y - 34, w + 20, 58, 10);
      ctx.fillStyle = "#fff4ef";
      ctx.fill();
    }
    ctx.fillStyle = highlight ? "#f0bcbc" : (isRent ? "#efb9a8" : "#dbe8f2");
    ctx.fillRect(x, y + 30, w, 2);
    ctx.fillStyle = highlight ? "#c64646" : (isRent ? "#d45a3a" : "#657789");
    ctx.font = "24px sans-serif";
    this.canvasText(ctx, label, x, y, w * 0.45);
    ctx.fillStyle = highlight ? "#c64646" : (isRent ? "#d45a3a" : "#0b1f33");
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "right";
    this.canvasText(ctx, value, x + w, y, w * 0.55);
    ctx.textAlign = "left";
    return y + 58;
  },

  drawReportSectionTitle(ctx, title, x, y) {
    ctx.fillStyle = "#004b8d";
    ctx.font = "bold 30px sans-serif";
    this.canvasText(ctx, title, x, y, 860);
    ctx.fillStyle = "#00a3e0";
    this.drawRoundRect(ctx, x, y + 14, 118, 8, 4);
    ctx.fill();
    return y + 48;
  },

  async drawImageSafe(canvas, ctx, src, x, y, w, h) {
    return new Promise((resolve) => {
      const image = canvas.createImage();
      image.onload = () => {
        ctx.drawImage(image, x, y, w, h);
        resolve();
      };
      image.onerror = () => resolve();
      image.src = src;
    });
  },

  createSummaryImage(event) {
    const action = event.currentTarget.dataset.action;
    if (!this.data.result) {
      wx.showToast({ title: "请先开始计算", icon: "none" });
      return;
    }

    wx.showLoading({ title: "生成中" });
    wx.createSelectorQuery()
      .select("#reportCanvas")
      .fields({ node: true, size: true })
      .exec(async (res) => {
        try {
          const canvas = res[0].node;
          const ctx = canvas.getContext("2d");
          canvas.width = 1080;
          const exportHeight = SUMMARY_CANVAS_HEIGHT + (this.data.result.hasLng ? LNG_SUMMARY_EXTRA_HEIGHT : 0);
          canvas.height = exportHeight;
          await this.drawSummaryCanvas(canvas, ctx, this.data.result);
          wx.canvasToTempFilePath({
            canvas,
            width: 1080,
            height: exportHeight,
            destWidth: 1080,
            destHeight: exportHeight,
            fileType: "png",
            success: (fileRes) => {
              wx.hideLoading();
              if (action === "share" && wx.showShareImageMenu) {
                wx.showShareImageMenu({ path: fileRes.tempFilePath });
                return;
              }
              wx.saveImageToPhotosAlbum({
                filePath: fileRes.tempFilePath,
                success: () => wx.showToast({ title: "已保存" }),
                fail: () => wx.showModal({ title: "保存失败", content: "请在微信权限设置中允许保存到相册。", showCancel: false })
              });
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: "图片生成失败", icon: "none" });
            }
          });
        } catch (error) {
          wx.hideLoading();
          wx.showToast({ title: "图片生成失败", icon: "none" });
        }
      });
  },

  createReportImage(event) {
    const action = event.currentTarget.dataset.action;
    if (!this.data.result) {
      wx.showToast({ title: "请先开始计算", icon: "none" });
      return;
    }
    if (!this.data.reportStationName.trim()) {
      wx.showToast({ title: "请填写站点名称", icon: "none" });
      return;
    }

    wx.showLoading({ title: "生成中" });
    wx.createSelectorQuery()
      .select("#reportCanvas")
      .fields({ node: true, size: true })
      .exec(async (res) => {
        try {
          const canvas = res[0].node;
          const ctx = canvas.getContext("2d");
          canvas.width = 1080;
          const exportHeight = FULL_REPORT_CANVAS_HEIGHT + (this.data.result.hasLng ? LNG_FULL_REPORT_EXTRA_HEIGHT : 0);
          canvas.height = exportHeight;
          await this.drawFullReportCanvas(canvas, ctx, this.data.result, this.data.reportStationName.trim());
          wx.canvasToTempFilePath({
            canvas,
            width: 1080,
            height: exportHeight,
            destWidth: 1080,
            destHeight: exportHeight,
            fileType: "png",
            success: (fileRes) => {
              wx.hideLoading();
              if (action === "share" && wx.showShareImageMenu) {
                wx.showShareImageMenu({ path: fileRes.tempFilePath });
                return;
              }
              wx.saveImageToPhotosAlbum({
                filePath: fileRes.tempFilePath,
                success: () => wx.showToast({ title: "已保存" }),
                fail: () => wx.showModal({ title: "保存失败", content: "请在微信权限设置中允许保存到相册。", showCancel: false })
              });
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: "图片生成失败", icon: "none" });
            }
          });
        } catch (error) {
          wx.hideLoading();
          wx.showToast({ title: "图片生成失败", icon: "none" });
        }
      });
  },

  async drawSummaryCanvas(canvas, ctx, result) {
    const blue = "#004b8d";
    const midBlue = "#0067b1";
    const cyan = "#00a3e0";
    const ink = "#0b1f33";
    const muted = "#657789";
    const canvasHeight = canvas.height;
    const bg = ctx.createLinearGradient(0, 0, 1080, canvasHeight);
    bg.addColorStop(0, "#f6fbff");
    bg.addColorStop(1, "#edf7fd");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, canvasHeight);

    this.drawRoundRect(ctx, 60, 60, 960, canvasHeight - 120, 34);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(11, 45, 78, .14)";
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 16;
    ctx.fill();
    ctx.shadowColor = "transparent";

    const header = ctx.createLinearGradient(60, 60, 1020, 330);
    header.addColorStop(0, blue);
    header.addColorStop(1, midBlue);
    this.drawRoundRect(ctx, 60, 60, 960, 300, 34);
    ctx.fillStyle = header;
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 50px sans-serif";
    this.canvasText(ctx, "加油（加气）站利润测算", 110, 155, 860);
    ctx.font = "27px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,.82)";
    this.canvasText(ctx, `简要分享图 · ${result.periodName}口径`, 110, 215, 860);
    this.canvasText(ctx, `测算时间：${formatChineseDate(result.time)}`, 110, 260, 860);
    ctx.fillStyle = cyan;
    this.drawRoundRect(ctx, 110, 296, 156, 12, 6);
    ctx.fill();

    let y = 430;
    y = this.drawReportRow(ctx, `${result.periodName}测算收入`, result.revenueTextFull, 110, y, 860);
    y = this.drawReportRow(ctx, `${result.periodName}成本合计`, result.costTextFull, 110, y, 860);
    y = this.drawReportRow(ctx, `${result.periodName}税费合计`, result.taxTextFull, 110, y, 860);
    y = this.drawReportRow(ctx, `${result.periodName}净利润`, result.profitText, 110, y, 860, true);
    y = this.drawReportRow(ctx, `${result.periodName}净回笼资金（EBITDA）`, result.ebitdaText, 110, y, 860, true);
    y = this.drawReportRow(ctx, "92# 日均销量", result.vol92DailyText, 110, y, 860);
    y = this.drawReportRow(ctx, "95# 日均销量", result.vol95DailyText, 110, y, 860);
    y = this.drawReportRow(ctx, "柴油日均销量", result.volDieselDailyText, 110, y, 860);
    if (result.hasLng) y = this.drawReportRow(ctx, "LNG 日均销量", result.volLngDailyText, 110, y, 860);

    const noteY = y + 22;
    this.drawRoundRect(ctx, 110, noteY, 860, 92, 16);
    ctx.fillStyle = "#f2f8fc";
    ctx.fill();
    ctx.fillStyle = muted;
    ctx.font = "21px sans-serif";
    this.wrapCanvasText(ctx, "简要分享图仅展示经营概要和已选择的油气销量，不显示站点名称、单项成本及用户身份信息。", 138, noteY + 36, 804, 28, 2);

    const footerY = noteY + 132;
    this.drawRoundRect(ctx, 110, footerY, 86, 86, 14);
    ctx.fillStyle = "#e7f4fb";
    ctx.fill();
    await this.drawImageSafe(canvas, ctx, "/images/jyzmt-qrcode.jpg", 110, footerY, 86, 86);
    await this.drawImageSafe(canvas, ctx, "/images/jyzmt-avatar.jpg", 220, footerY + 3, 54, 54);
    ctx.fillStyle = ink;
    ctx.font = "bold 24px sans-serif";
    this.canvasText(ctx, "加油站漫谈", 296, footerY + 25, 620);
    ctx.fillStyle = muted;
    ctx.font = "20px sans-serif";
    this.canvasText(ctx, "欢迎关注公众号，交流油气站经营、利润测算和合规管理", 296, footerY + 61, 620);
    return footerY + 116;
  },

  async drawFullReportCanvas(canvas, ctx, result, stationName) {
    const blue = "#004b8d";
    const midBlue = "#0067b1";
    const cyan = "#00a3e0";
    const ink = "#0b1f33";
    const muted = "#657789";
    const canvasHeight = canvas.height;
    const bg = ctx.createLinearGradient(0, 0, 1080, canvasHeight);
    bg.addColorStop(0, "#f6fbff");
    bg.addColorStop(0.55, "#edf7fd");
    bg.addColorStop(1, "#ffffff");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, canvasHeight);

    this.drawRoundRect(ctx, 60, 60, 960, canvasHeight - 120, 34);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(11, 45, 78, .14)";
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 16;
    ctx.fill();
    ctx.shadowColor = "transparent";

    const header = ctx.createLinearGradient(60, 60, 1020, 320);
    header.addColorStop(0, blue);
    header.addColorStop(1, midBlue);
    this.drawRoundRect(ctx, 60, 60, 960, 300, 34);
    ctx.fillStyle = header;
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px sans-serif";
    this.canvasText(ctx, "加油（加气）站利润测算报告", 110, 155, 860);
    ctx.font = "28px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,.82)";
    this.canvasText(ctx, stationName, 110, 210, 860);
    this.canvasText(ctx, `测算时间：${formatChineseDate(result.time)}`, 110, 255, 860);
    ctx.fillStyle = cyan;
    this.drawRoundRect(ctx, 110, 290, 156, 12, 6);
    ctx.fill();

    let y = 430;
    y = this.drawReportSectionTitle(ctx, "一、经营概览", 110, y);
    y = this.drawReportRow(ctx, `${result.periodName}测算收入`, result.revenueTextFull, 110, y, 860);
    y = this.drawReportRow(ctx, `${result.periodName}成本合计`, result.costTextFull, 110, y, 860);
    y = this.drawReportRow(ctx, `${result.periodName}税费合计`, result.taxTextFull, 110, y, 860);
    y = this.drawReportRow(ctx, `${result.periodName}净利润`, result.profitText, 110, y, 860, true);
    y = this.drawReportRow(ctx, `${result.periodName}净回笼资金（EBITDA）`, result.ebitdaText, 110, y, 860, true);
    y = this.drawReportRow(ctx, `${result.periodName}油气销量`, result.totalTonsText, 110, y, 860);

    y += 28;
    y = this.drawReportSectionTitle(ctx, "二、压力指标", 110, y);
    y = this.drawReportRow(ctx, "净利率", result.profitRateText, 110, y, 860);
    y = this.drawReportRow(ctx, "成本占测算收入", result.costRateText, 110, y, 860);
    y = this.drawReportRow(ctx, "税费占测算收入", result.taxRateText, 110, y, 860);
    y = this.drawReportRow(ctx, "汽油销量 / 毛利率", result.gasolineVolumeMarginText, 110, y, 860);
    y = this.drawReportRow(ctx, "柴油销量 / 毛利率", result.dieselVolumeMarginText, 110, y, 860);
    if (result.hasLng) y = this.drawReportRow(ctx, "LNG 销量 / 毛利率", result.lngVolumeMarginText, 110, y, 860);
    y = this.drawReportRow(ctx, "汽油管理费用（每吨 / 每升）", result.gasExpenseText, 110, y, 860);
    y = this.drawReportRow(ctx, "汽油租金成本（每吨 / 每升）", result.gasRentText, 110, y, 860, false, "rent");
    y = this.drawReportRow(ctx, "柴油管理费用（每吨 / 每升）", result.dieselExpenseText, 110, y, 860);
    y = this.drawReportRow(ctx, "柴油租金成本（每吨 / 每升）", result.dieselRentText, 110, y, 860, false, "rent");
    if (result.hasLng) y = this.drawReportRow(ctx, "LNG 管理费用（每吨 / 每公斤）", result.lngExpenseText, 110, y, 860);
    if (result.hasLng) y = this.drawReportRow(ctx, "LNG 租金成本（每吨 / 每公斤）", result.lngRentText, 110, y, 860, false, "rent");
    y = this.drawReportRow(ctx, "共同费用分摊系数", result.splitRatioLabel, 110, y, 860);

    y += 28;
    y = this.drawReportSectionTitle(ctx, "三、油气结构", 110, y);
    y = this.drawReportRow(ctx, "92# 日均 / 年销量", `${num(this.data.form.vol92).toLocaleString("zh-CN")} 升/天 / ${result.tons.t92.toFixed(2)} 吨`, 110, y, 860);
    y = this.drawReportRow(ctx, "95# 日均 / 年销量", `${num(this.data.form.vol95).toLocaleString("zh-CN")} 升/天 / ${result.tons.t95.toFixed(2)} 吨`, 110, y, 860);
    y = this.drawReportRow(ctx, "柴油日均 / 年销量", `${num(this.data.form.volDiesel).toLocaleString("zh-CN")} 升/天 / ${result.tons.td.toFixed(2)} 吨`, 110, y, 860);
    if (result.hasLng) y = this.drawReportRow(ctx, "LNG 日均 / 年销量", `${num(this.data.form.volLng).toLocaleString("zh-CN")} 公斤/天 / ${result.tons.tlng.toFixed(2)} 吨`, 110, y, 860);

    y += 28;
    y = this.drawReportSectionTitle(ctx, "四、成本结构", 110, y);
    result.costLines.forEach((item) => {
      y = this.drawReportRow(ctx, item.label, item.value, 110, y, 860, false, item.tone || "");
    });

    y += 28;
    y = this.drawReportSectionTitle(ctx, "五、税费摘要", 110, y);
    y = this.drawReportRow(ctx, "增值税应纳税额", scaledMoneyWan(result.taxes.vatPayable, result.periodScale), 110, y, 860);
    y = this.drawReportRow(ctx, "城建税及附加", scaledMoneyWan(result.taxes.cityTax + result.taxes.edu + result.taxes.localEdu, result.periodScale), 110, y, 860);
    y = this.drawReportRow(ctx, "印花税", scaledMoneyWan(result.taxes.stamp, result.periodScale), 110, y, 860);
    y = this.drawReportRow(ctx, "企业所得税", scaledMoneyWan(result.taxes.corpTax, result.periodScale), 110, y, 860);

    y += 28;
    y = this.drawReportSectionTitle(ctx, "六、报告提示", 110, y);
    result.actions.forEach((item, index) => {
      ctx.fillStyle = ink;
      ctx.font = "bold 25px sans-serif";
      this.canvasText(ctx, `${index + 1}. ${item.title}`, 110, y, 860);
      ctx.fillStyle = muted;
      ctx.font = "23px sans-serif";
      y = this.wrapCanvasText(ctx, item.body, 110, y + 34, 860, 31, 2) + 12;
    });

    const disclaimerY = y + 28;
    const footerY = disclaimerY + 140;
    ctx.fillStyle = "#f2f8fc";
    this.drawRoundRect(ctx, 110, disclaimerY, 860, 104, 18);
    ctx.fill();
    ctx.fillStyle = muted;
    ctx.font = "21px sans-serif";
    this.wrapCanvasText(ctx, "免责声明：本工具测算结果基于用户自行填写的数据和系统内置估算公式，仅用于经营参考，不构成税务、财务、法律或投资建议，不作为纳税申报依据。", 138, disclaimerY + 38, 804, 28, 2);

    this.drawRoundRect(ctx, 110, footerY, 76, 76, 14);
    ctx.fillStyle = "#e7f4fb";
    ctx.fill();
    await this.drawImageSafe(canvas, ctx, "/images/jyzmt-qrcode.jpg", 110, footerY, 76, 76);
    await this.drawImageSafe(canvas, ctx, "/images/jyzmt-avatar.jpg", 202, footerY + 2, 48, 48);
    ctx.fillStyle = ink;
    ctx.font = "bold 23px sans-serif";
    this.canvasText(ctx, "加油站漫谈", 272, footerY + 22, 650);
    ctx.fillStyle = muted;
    ctx.font = "20px sans-serif";
    this.canvasText(ctx, "欢迎关注公众号，交流油气站经营、利润测算和合规管理", 272, footerY + 54, 650);
    return footerY + 106;
  },

  onLeadInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [`lead.${field}`]: event.detail.value });
  },

  onLeadDemandChange(event) {
    const index = Number(event.detail.value);
    this.setData({ leadDemandIndex: index, leadDemandLabel: this.data.demandTypes[index] });
  },

  onLeadStatusChange(event) {
    const index = Number(event.detail.value);
    this.setData({ leadStatusIndex: index, leadStatusLabel: this.data.stationStatuses[index] });
  },

  onLeadTypeChange(event) {
    const index = Number(event.detail.value);
    this.setData({ leadTypeIndex: index, leadTypeLabel: this.data.stationTypes[index] });
  },

  onLeadLandCertChange(event) {
    const index = Number(event.detail.value);
    this.setData({ leadLandCertIndex: index, leadLandCertLabel: this.data.landCertOptions[index] });
  },

  toggleLeadConsent() {
    this.setData({ leadConsent: !this.data.leadConsent });
  },

  loadAssetLeadRecords() {
    const stored = wx.getStorageSync("gasStationAssetLeads");
    const list = Array.isArray(stored) ? stored : [];
    const records = list.map((item, index) => ({
      ...item,
      recordNo: list.length - index,
      timeDisplay: formatLocalTime(item.time),
      regionDisplay: item.region || "地区未填写",
      stationStatusDisplay: item.stationStatus && item.stationStatus !== "请选择" ? item.stationStatus : "状态未填写",
      stationTypeDisplay: item.stationType && item.stationType !== "请选择" ? item.stationType : "类型未填写",
      landCertDisplay: item.landCert && item.landCert !== "请选择" ? `土地证：${item.landCert}` : "土地证：未填写"
    }));
    this.setData({
      assetLeadRecords: records,
      hasAssetLeadRecords: records.length > 0
    });
  },

  submitAssetLead() {
    const lead = this.data.lead;
    if (!lead.assetContactName) {
      wx.showToast({ title: "请填写称呼", icon: "none" });
      return;
    }
    if (!lead.assetContactMethod) {
      wx.showToast({ title: "请填写联系方式", icon: "none" });
      return;
    }
    if (this.data.leadDemandIndex <= 0) {
      wx.showToast({ title: "请选择需求类型", icon: "none" });
      return;
    }
    if (!this.data.leadConsent) {
      wx.showToast({ title: "请先勾选自愿提交确认", icon: "none" });
      return;
    }

    const item = {
      name: lead.assetContactName,
      contact: lead.assetContactMethod,
      region: lead.assetRegion,
      demandType: this.data.demandTypes[this.data.leadDemandIndex],
      stationStatus: this.data.stationStatuses[this.data.leadStatusIndex] || "",
      stationType: this.data.stationTypes[this.data.leadTypeIndex] || "",
      landCert: this.data.landCertOptions[this.data.leadLandCertIndex] || "",
      time: new Date().toISOString()
    };
    const list = wx.getStorageSync("gasStationAssetLeads") || [];
    list.unshift(item);
    wx.setStorageSync("gasStationAssetLeads", list.slice(0, 30));
    this.setData({
      lead: { assetContactName: "", assetContactMethod: "", assetRegion: "" },
      leadDemandIndex: 0,
      leadStatusIndex: 0,
      leadTypeIndex: 0,
      leadLandCertIndex: 0,
      leadDemandLabel: "请选择",
      leadStatusLabel: "请选择",
      leadTypeLabel: "请选择",
      leadLandCertLabel: "请选择",
      leadConsent: false
    });
    this.loadAssetLeadRecords();
    wx.showModal({
      title: "登记成功",
      content: "已生成登记记录，可在下方“我的登记记录”中查看。当前预览版记录仅保存在本机；正式接入后台后，服务团队可据此跟进并协助匹配意向客户。",
      showCancel: false,
      confirmText: "查看记录"
    });
  },

  onMessageInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [`message.${field}`]: event.detail.value });
  },

  submitMessage() {
    const message = this.data.message;
    if (!message.messageContent) {
      wx.showToast({ title: "请填写留言内容", icon: "none" });
      return;
    }
    const list = wx.getStorageSync("gasStationCalcMessages") || [];
    list.unshift({
      name: message.messageName,
      contact: message.messageContact,
      content: message.messageContent,
      time: new Date().toISOString()
    });
    wx.setStorageSync("gasStationCalcMessages", list.slice(0, 30));
    this.setData({ message: { messageName: "", messageContact: "", messageContent: "" } });
    wx.showToast({ title: "已提交" });
  }
});
