import React, { useState, useCallback } from "react" ;
import {
  Upload,
  Play,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const styles = `
  :root{
    --bg1:#f0f5ff; --bg2:#e6e9ff; --card:#ffffff; --muted:#6b7280;
    --text:#1f2937; --blue:#4f46e5; --blue-600:#4338ca; --indigo:#6366f1; --green:#16a34a;
    --orange:#f97316; --purple:#8b5cf6; --shadow:0 10px 22px rgba(0,0,0,.06);
    --border:#e5e7eb; --yellow:#ca8a04; --yellow-700:#a16207; --red:#dc2626;
  }
  *{box-sizing:border-box}
  body{margin:0}
  .app{min-height:100vh;background:linear-gradient(135deg,var(--bg1),var(--bg2));font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial}
  .container{max-width:1200px;margin:0 auto;padding:0 24px}
  .header{background:var(--card);box-shadow:var(--shadow)}
  .header-wrap{padding:32px 24px}
  .title{font-size:32px;font-weight:800;color:var(--text);margin:0 0 6px}
  .subtitle{font-size:18px;color:#475569;margin:0 0 12px}
  .lead{max-width:800px;color:#6b7280;line-height:1.6}

  .card{background:var(--card);border-radius:14px;box-shadow:var(--shadow);padding:24px;margin-bottom:24px}
  .card-title{font-size:22px;font-weight:700;color:var(--text);margin:0 0 20px}

  .grid{display:grid;gap:24px}
  .grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}
  @media (max-width:1024px){.grid-2{grid-template-columns:1fr}}

  .uploader{border:2px dashed var(--border);border-radius:12px;padding:24px;text-align:center;transition:border-color .2s}
  .uploader:hover{border-color:var(--blue)}
  .uploader h4{margin:10px 0;font-size:16px}
  .uploader p{margin:6px 0;color:var(--muted)}
  .file-btn{display:inline-block;background:var(--blue);color:#fff;padding:10px 16px;border-radius:8px;cursor:pointer;transition:background .2s}
  .file-btn.green{background:#16a34a}
  .file-btn:hover{background:var(--blue-600)}
  .file-btn.green:hover{background:#15803d}
  .ok{color:#16a34a;margin-top:8px}

  .center{text-align:center}
  .primary-btn{display:inline-flex;align-items:center;gap:8px;background:var(--indigo);color:#fff;border:none;padding:12px 20px;border-radius:10px;font-weight:700;cursor:pointer;box-shadow:var(--shadow);transition:background .2s}
  .primary-btn:disabled{background:#cbd5e1;cursor:not-allowed}
  .primary-btn:hover{background:#4f46e5}
  .hint{margin-top:8px;font-size:14px;color:#64748b}
  .error{color:var(--red);margin-top:8px}

  .progress{height:12px;background:#e5e7eb;border-radius:999px;overflow:hidden}
  .progress > div{height:100%;background:var(--indigo);border-radius:999px;transition:width .5s}
  .progress-txt{font-size:13px;color:#64748b;margin-top:6px}

  .kpis{display:grid;gap:18px;grid-template-columns:repeat(4,minmax(0,1fr));margin-bottom:24px}
  @media (max-width:1024px){.kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
  .kpi{color:#fff;border-radius:12px;padding:18px;background:linear-gradient(90deg,rgba(59,130,246,.95),rgba(37,99,235,.95))}
  .kpi.green{background:linear-gradient(90deg,rgba(34,197,94,.95),rgba(22,163,74,.95))}
  .kpi.purple{background:linear-gradient(90deg,rgba(168,85,247,.95),rgba(126,34,206,.95))}
  .kpi.orange{background:linear-gradient(90deg,rgba(249,115,22,.95),rgba(234,88,12,.95))}
  .kpi p{margin:0}
  .kpi .label{opacity:.9}
  .kpi .value{font-size:22px;font-weight:800;margin-top:6px}
  .kpi .icon{opacity:.8}

  .chart{background:#f8fafc;border-radius:12px;padding:16px}
  .chart h4{margin:0 0 10px;font-size:16px;font-weight:700;color:var(--text)}

  .budget{background:#fffbeb;border:1px solid #fef3c7;border-radius:12px;padding:16px}
  .budget h4{margin:0 0 10px;color:#854d0e}
  .budget .preview{margin-top:10px;background:#eff6ff;border:1px solid #dbeafe;border-radius:10px;padding:10px;color:#1e40af}
  .number{width:100%;padding:12px;border:1px solid var(--border);border-radius:10px}
  .budget .btn{background:#d97706;color:#fff;border:none;padding:12px 18px;border-radius:10px;font-weight:700;cursor:pointer;transition:background .2s}
  .budget .btn:disabled{background:#cbd5e1}
  .budget .btn:hover{background:#b45309}

  .table-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
  .export{display:inline-flex;align-items:center;gap:8px;background:#16a34a;color:#fff;border:none;padding:10px 16px;border-radius:10px;cursor:pointer;transition:background .2s;box-shadow:var(--shadow)}
  .export:hover{background:#15803d}
  .tip{color:#64748b;font-size:14px}

  table{width:100%;border-collapse:collapse}
  th,td{border:1px solid var(--border);padding:12px}
  th{text-align:left;background:#f9fafb;font-weight:700}
  td.right{text-align:right}
  td.center{text-align:center}
  .badge{padding:4px 8px;border-radius:999px;font-size:12px;font-weight:700;display:inline-block}
  .badge.green{background:#dcfce7;color:#166534}
  .badge.red{background:#fee2e2;color:#991b1b}
  .badge.gray{background:#f3f4f6;color:#374151}
  .input{width:100%;padding:8px;border:1px solid var(--border);border-radius:8px;text-align:center}

  .pager{display:flex;justify-content:space-between;align-items:center;margin-top:16px}
  .pager .meta{color:#64748b}
  .pager .btn{padding:8px 14px;border:1px solid var(--border);border-radius:8px;background:#fff;cursor:pointer}
  .pager .btn[disabled]{opacity:.5;cursor:not-allowed}
  .pager .page{padding:8px 14px;border-radius:8px;background:#dbeafe;color:#1e40af}
`;

const BonusPredictionDashboard = () => {
  const [historicalData, setHistoricalData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overview, setOverview] = useState(null);
  const [adjustedTotalBudget, setAdjustedTotalBudget] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customerAdjustments, setCustomerAdjustments] = useState({});
  const itemsPerPage = 50;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // 工具函數
  const getFieldValue = (record, possibleNames) => {
    for (const name of possibleNames) {
      if (
        record[name] !== undefined &&
        record[name] !== null &&
        record[name] !== ""
      ) {
        return record[name];
      }
    }
    return null;
  };

  const safeParseFloat = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const formats = [
      dateStr,
      dateStr.replace(/\//g, "-"),
      dateStr.replace(/-/g, "/"),
    ];
    for (const format of formats) {
      const date = new Date(format);
      if (!isNaN(date.getTime())) return date;
    }
    const parts = dateStr.split(/[\/\-]/);
    if (parts.length === 3) {
      const [p1, p2, p3] = parts.map((p) => parseInt(p));
      if (p1 > 1900) {
        const date = new Date(p1, p2 - 1, p3);
        if (!isNaN(date.getTime())) return date;
      }
      if (p3 > 1900) {
        const date = new Date(p3, p1 - 1, p2);
        if (!isNaN(date.getTime())) return date;
      }
    }
    return null;
  };

  // 檔案上傳處理
  const handleFileUpload = useCallback((file, type) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data;
        if (file.name.endsWith(".csv")) {
          data = Papa.parse(e.target.result, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            delimitersToGuess: [",", "\t", "|", ";"],
          }).data;
        } else {
          const workbook = XLSX.read(e.target.result, { type: "binary" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          data = XLSX.utils.sheet_to_json(firstSheet);
        }
        if (type === "historical") setHistoricalData(data);
        else setSalesData(data);
      } catch (error) {
        alert(`檔案解析失敗: ${error.message}`);
      }
    };
    if (file.name.endsWith(".csv")) reader.readAsText(file, "UTF-8");
    else reader.readAsBinaryString(file);
  }, []);

  // 特徵計算 - 加強產品識別
  const calculateFeatures = (salesData) => {
    if (!salesData || salesData.length === 0) return {};
    const customerFeatures = {};
    const currentYear = new Date().getFullYear();
    let categoryStats = { 冷氣類: 0, 非冷氣類: 0 };
    let brandStats = { HERAN: 0, YAMADA: 0, 其他: 0 };

    salesData.forEach((record) => {
      const customerCode = getFieldValue(record, [
        "客戶代號",
        "客戶代碼",
        "CustomerCode",
        "Customer",
      ]);
      const dateStr = getFieldValue(record, [
        "單據日期",
        "交易日期",
        "Date",
        "日期",
      ]);
      const salesAmount = safeParseFloat(
        getFieldValue(record, ["銷售金額", "銷售額", "SalesAmount", "金額"])
      );
      const quantity = safeParseFloat(
        getFieldValue(record, ["銷售數量", "數量", "Quantity", "銷售量"])
      );
      const grossProfit = safeParseFloat(
        getFieldValue(record, ["銷貨毛利", "毛利", "GrossProfit", "毛利額"])
      );
      const productCategory = getFieldValue(record, [
        "產品類別",
        "產品分類",
        "Category",
        "類別",
        "產品類型",
      ]);
      const brand = getFieldValue(record, [
        "廠商商標名稱",
        "產品品牌",
        "品牌",
        "Brand",
        "廠商",
        "品牌名稱",
      ]);
      const productName = getFieldValue(record, [
        "品名",
        "產品名稱",
        "ProductName",
        "商品名稱",
        "規格",
      ]);
      if (!customerCode) return;
      const recordDate = parseDate(dateStr);
      if (!recordDate) return;
      const recordYear = recordDate.getFullYear();

      if (!customerFeatures[customerCode]) {
        customerFeatures[customerCode] = {
          總銷售額: 0,
          總銷貨毛利額: 0,
          總銷售數量: 0,
          交易筆數: 0,
          冷氣類銷售額: 0,
          冷氣類銷售數量: 0,
          冷氣類銷貨毛利: 0,
          冷氣類HERAN銷售額: 0,
          冷氣類HERAN銷售數量: 0,
          冷氣類HERAN銷貨毛利: 0,
          冷氣類YAMADA銷售額: 0,
          冷氣類YAMADA銷售數量: 0,
          冷氣類YAMADA銷貨毛利: 0,
          非冷氣類銷售額: 0,
          非冷氣類銷售數量: 0,
          非冷氣類銷貨毛利: 0,
          非冷氣類HERAN銷售額: 0,
          非冷氣類HERAN銷售數量: 0,
          非冷氣類HERAN銷貨毛利: 0,
          非冷氣類YAMADA銷售額: 0,
          非冷氣類YAMADA銷售數量: 0,
          非冷氣類YAMADA銷貨毛利: 0,
          非冷氣類其他銷售額: 0,
          非冷氣類其他銷售數量: 0,
          非冷氣類其他銷貨毛利: 0,
        };
      }

      if (recordYear >= currentYear - 1) {
        const customer = customerFeatures[customerCode];
        customer.總銷售額 += salesAmount;
        customer.總銷貨毛利額 += grossProfit;
        customer.總銷售數量 += quantity;
        customer.交易筆數 += 1;

        const categoryStr = (productCategory || "").toString().toLowerCase();
        const productNameStr = (productName || "").toString().toLowerCase();
        const isAC =
          categoryStr.includes("冷氣") ||
          categoryStr.includes("冷气") ||
          categoryStr.includes("ac") ||
          categoryStr.includes("air") ||
          categoryStr.includes("空調") ||
          categoryStr.includes("空调") ||
          categoryStr === "冷氣類" ||
          productNameStr.includes("冷氣") ||
          productNameStr.includes("冷气") ||
          productNameStr.includes("空調") ||
          productNameStr.includes("空调") ||
          productNameStr.includes("分離式") ||
          productNameStr.includes("變頻") ||
          productNameStr.includes("窗型") ||
          productNameStr.includes("吊隱") ||
          productNameStr.includes("壁掛") ||
          productNameStr.includes("冷暖") ||
          productNameStr.includes("冷專") ||
          productNameStr.includes("一對一") ||
          productNameStr.includes("一對二") ||
          productNameStr.includes("一對三") ||
          productNameStr.includes("一對四") ||
          productNameStr.includes("室內機") ||
          productNameStr.includes("室外機") ||
          productNameStr.includes("btu") ||
          /\d+匹/.test(productNameStr) ||
          /\d+坪/.test(productNameStr) ||
          /\d+btu/i.test(productNameStr) ||
          /hi-[a-z]\d+/i.test(productNameStr) ||
          /hbwg/i.test(productNameStr) ||
          /hbs/i.test(productNameStr) ||
          /hbw/i.test(productNameStr);

        const brandStr = (brand || "").toString().toLowerCase().trim();
        const isHERAN =
          brandStr === "heran" ||
          brandStr.includes("heran") ||
          brandStr.includes("禾聯") ||
          brandStr.includes("禾联") ||
          brandStr === "hr" ||
          brandStr.startsWith("heran") ||
          brandStr.endsWith("heran");
        const isYAMADA =
          brandStr === "yamada" ||
          brandStr.includes("yamada") ||
          brandStr.includes("山田") ||
          brandStr === "ym" ||
          brandStr.startsWith("yamada") ||
          brandStr.endsWith("yamada");

        if (isAC) categoryStats.冷氣類++;
        else categoryStats.非冷氣類++;
        if (isHERAN) brandStats.HERAN++;
        else if (isYAMADA) brandStats.YAMADA++;
        else brandStats.其他++;

        if (isAC) {
          customer.冷氣類銷售額 += salesAmount;
          customer.冷氣類銷售數量 += quantity;
          customer.冷氣類銷貨毛利 += grossProfit;
          if (isHERAN) {
            customer.冷氣類HERAN銷售額 += salesAmount;
            customer.冷氣類HERAN銷售數量 += quantity;
            customer.冷氣類HERAN銷貨毛利 += grossProfit;
          } else if (isYAMADA) {
            customer.冷氣類YAMADA銷售額 += salesAmount;
            customer.冷氣類YAMADA銷售數量 += quantity;
            customer.冷氣類YAMADA銷貨毛利 += grossProfit;
          }
        } else {
          customer.非冷氣類銷售額 += salesAmount;
          customer.非冷氣類銷售數量 += quantity;
          customer.非冷氣類銷貨毛利 += grossProfit;
          if (isHERAN) {
            customer.非冷氣類HERAN銷售額 += salesAmount;
            customer.非冷氣類HERAN銷售數量 += quantity;
            customer.非冷氣類HERAN銷貨毛利 += grossProfit;
          } else if (isYAMADA) {
            customer.非冷氣類YAMADA銷售額 += salesAmount;
            customer.非冷氣類YAMADA銷售數量 += quantity;
            customer.非冷氣類YAMADA銷貨毛利 += grossProfit;
          } else {
            customer.非冷氣類其他銷售額 += salesAmount;
            customer.非冷氣類其他銷售數量 += quantity;
            customer.非冷氣類其他銷貨毛利 += grossProfit;
          }
        }
      }
    });

    Object.keys(customerFeatures).forEach((customerCode) => {
      const c = customerFeatures[customerCode];
      c.平均單筆銷售額 = c.交易筆數 > 0 ? c.總銷售額 / c.交易筆數 : 0;
      c.平均單筆銷貨毛利 = c.交易筆數 > 0 ? c.總銷貨毛利額 / c.交易筆數 : 0;
      c.平均毛利率 = c.總銷售額 > 0 ? c.總銷貨毛利額 / c.總銷售額 : 0;
      c.冷氣類銷售金額占比 = c.總銷售額 > 0 ? c.冷氣類銷售額 / c.總銷售額 : 0;
      c.冷氣類銷貨毛利占比 =
        c.總銷貨毛利額 > 0 ? c.冷氣類銷貨毛利 / c.總銷貨毛利額 : 0;
      c.冷氣類平均毛利率 =
        c.冷氣類銷售額 > 0 ? c.冷氣類銷貨毛利 / c.冷氣類銷售額 : 0;
      c.非冷氣類銷售金額占比 =
        c.總銷售額 > 0 ? c.非冷氣類銷售額 / c.總銷售額 : 0;
      c.非冷氣類銷貨毛利占比 =
        c.總銷貨毛利額 > 0 ? c.非冷氣類銷貨毛利 / c.總銷貨毛利額 : 0;
      c.非冷氣類平均毛利率 =
        c.非冷氣類銷售額 > 0 ? c.非冷氣類銷貨毛利 / c.非冷氣類銷售額 : 0;
    });

    return customerFeatures;
  };

  // 獎金預測
  const predictBonus = (features, historicalData) => {
    const trainingData = [];
    historicalData.forEach((record) => {
      const bonus = safeParseFloat(
        getFieldValue(record, ["最終獎金", "實發獎金", "Bonus", "獎金"])
      );
      const sales = safeParseFloat(
        getFieldValue(record, [
          "銷售總銷售額",
          "總銷售額",
          "出貨實績",
          "TotalSales",
        ])
      );
      if (bonus > 0 && sales > 0) trainingData.push({ sales, bonus });
    });

    if (trainingData.length === 0) {
      const predictions = {};
      Object.keys(features).forEach((k) => {
        const c = features[k];
        const base = c.總銷售額 * 0.01 + c.總銷貨毛利額 * 0.05;
        predictions[k] = Math.max(1000, base);
      });
      return predictions;
    }

    const avgBonus =
      trainingData.reduce((s, d) => s + d.bonus, 0) / trainingData.length;
    const avgSales =
      trainingData.reduce((s, d) => s + d.sales, 0) / trainingData.length;
    const salesWeight = avgSales > 0 ? (avgBonus / avgSales) * 0.5 : 0.0001;
    const baseBonus = avgBonus * 0.2;

    const predictions = {};
    Object.keys(features).forEach((k) => {
      const c = features[k];
      let p = baseBonus;
      p += c.總銷售額 * salesWeight;
      p += c.總銷貨毛利額 * 0.001;
      p += c.總銷售數量 * 50;
      if (c.冷氣類銷售金額占比 > 0.5) p *= 1.2;
      predictions[k] = Math.max(1000, p);
    });
    return predictions;
  };

  // 去年資料
  const getLastYearData = (customerCode) => {
    if (!historicalData) return { 去年實績: 0, 去年獎金: 0, 發放狀態: "未知" };
    let customerRecord = historicalData.find((r) => {
      const code = getFieldValue(r, [
        "客戶代號",
        "客戶代碼",
        "CustomerCode",
        "Customer",
      ]);
      return code === customerCode;
    });
    if (!customerRecord) {
      customerRecord = historicalData.find((r) => {
        const code = getFieldValue(r, [
          "客戶代號",
          "客戶代碼",
          "CustomerCode",
          "Customer",
        ]);
        if (!code) return false;
        return code.toString().trim() === customerCode.toString().trim();
      });
    }
    if (!customerRecord)
      return { 去年實績: 0, 去年獎金: 0, 發放狀態: "新客戶" };
    const 去年實績 = safeParseFloat(
      getFieldValue(customerRecord, [
        "出貨實績",
        "去年實績",
        "總銷售額",
        "LastYearSales",
        "銷售總銷售額",
        "年度總銷售額",
        "TotalSales",
      ])
    );
    const 去年獎金 = safeParseFloat(
      getFieldValue(customerRecord, [
        "最終獎金",
        "實發獎金",
        "去年獎金",
        "LastYearBonus",
        "Bonus",
        "獎金",
        "年終獎金",
      ])
    );
    const 發放狀態 =
      getFieldValue(customerRecord, [
        "發放狀態",
        "業績狀況",
        "Status",
        "成長狀況",
      ]) || "未知";
    return { 去年實績, 去年獎金, 發放狀態 };
  };

  // 分析
  const analyzeData = async () => {
    try {
      if (!historicalData || !salesData) {
        alert("請先上傳兩個檔案");
        return;
      }
      setIsProcessing(true);
      setProgress(10);
      await new Promise((r) => setTimeout(r, 200));
      setProgress(25);
      const features = calculateFeatures(salesData);
      if (Object.keys(features).length === 0)
        throw new Error("沒有成功計算出任何客戶特徵，請檢查資料格式");
      setProgress(50);
      const bonusPredictions = predictBonus(features, historicalData);
      setProgress(75);
      const results = {};
      let matched = 0;
      Object.keys(features).forEach((code) => {
        const f = features[code];
        const last = getLastYearData(code);
        if (last.去年實績 > 0) matched++;
        results[code] = {
          ...f,
          ...last,
          今年實績: f.總銷售額,
          預測獎金: bonusPredictions[code] || 0,
          業績狀況:
            last.去年實績 > 0
              ? f.總銷售額 > last.去年實績
                ? "一年成長"
                : "一年衰退"
              : "新客戶",
        };
      });
      setProgress(90);
      const totalSales = Object.values(features).reduce(
        (s, c) => s + c.總銷售額,
        0
      );
      const totalGrossProfit = Object.values(features).reduce(
        (s, c) => s + c.總銷貨毛利額,
        0
      );
      const totalACQuantity = Object.values(features).reduce(
        (s, c) => s + c.冷氣類銷售數量,
        0
      );
      const customerCount = Object.keys(features).length;
      const totalPredictedBonus = Object.values(bonusPredictions).reduce(
        (s, b) => s + b,
        0
      );
      const overviewData = {
        totalSales,
        totalGrossProfit,
        totalACQuantity,
        customerCount,
        avgBonus: customerCount ? totalPredictedBonus / customerCount : 0,
        totalPredictedBonus,
      };
      setOverview(overviewData);
      setProcessedData(results);
      setPredictions(bonusPredictions);
      setProgress(100);
      await new Promise((r) => setTimeout(r, 400));
      alert(
        `分析完成！\n客戶數: ${customerCount}\n總銷售額: $${totalSales.toLocaleString()}\n預測總獎金: $${totalPredictedBonus.toLocaleString()}\n匹配到歷史資料: ${matched} 個`
      );
    } catch (e) {
      alert(`分析失敗: ${e.message}`);
      setProgress(0);
    } finally {
      setTimeout(() => setIsProcessing(false), 800);
    }
  };

  // 總預算調整
  const adjustTotalBudget = () => {
    if (!adjustedTotalBudget || !predictions) {
      alert("請輸入期望的獎金總額");
      return;
    }
    const newTotal = parseFloat(adjustedTotalBudget);
    if (isNaN(newTotal) || newTotal <= 0) {
      alert("請輸入有效的獎金總額");
      return;
    }
    const originalTotal = Object.values(predictions).reduce((s, b) => s + b, 0);
    if (originalTotal === 0) {
      alert("無法重新分配，原始預測總額為0");
      return;
    }
    const ratio = newTotal / originalTotal;
    const adjusted = {};
    Object.keys(predictions).forEach((code) => {
      adjusted[code] = predictions[code] * ratio;
    });
    setPredictions(adjusted);
    const updated = { ...processedData };
    Object.keys(updated).forEach((code) => {
      updated[code].預測獎金 = adjusted[code];
    });
    setProcessedData(updated);
    setOverview({
      ...overview,
      totalPredictedBonus: newTotal,
      avgBonus: newTotal / overview.customerCount,
    });
    setCustomerAdjustments({});
    alert(
      `獎金重新分配成功！\n新的總獎金: ${newTotal.toLocaleString()}\n平均獎金: ${(
        newTotal / overview.customerCount
      ).toLocaleString()}`
    );
  };

  const handleCustomerAdjustment = (customerCode, percentage) => {
    setCustomerAdjustments((prev) => ({ ...prev, [customerCode]: percentage }));
  };

  const calculateFinalBonus = (customerCode) => {
    const baseBonus = predictions?.[customerCode] || 0;
    const adjustment = customerAdjustments[customerCode] || 0;
    return baseBonus * (1 + adjustment / 100);
  };

  const exportCSV = () => {
    try {
      if (!processedData) {
        alert("沒有資料可以匯出，請先完成分析");
        return;
      }
      const csvData = Object.keys(processedData).map((customerCode, index) => {
        const data = processedData[customerCode];
        const finalBonus = calculateFinalBonus(customerCode);
        const adjustmentPercentage = customerAdjustments[customerCode] || 0;
        return {
          序號: index + 1,
          客戶代號: customerCode || "",
          去年實績: Math.round(data.去年實績 || 0),
          今年實績: Math.round(data.今年實績 || 0),
          業績狀況: data.業績狀況 || "未知",
          冷氣類銷售數量: Math.round(data.冷氣類銷售數量 || 0),
          冷氣類HERAN銷售數量: Math.round(data.冷氣類HERAN銷售數量 || 0),
          冷氣類YAMADA銷售數量: Math.round(data.冷氣類YAMADA銷售數量 || 0),
          總銷售額: Math.round(data.總銷售額 || 0),
          銷貨毛利額: Math.round(data.總銷貨毛利額 || 0),
          平均毛利率: ((data.平均毛利率 || 0) * 100).toFixed(2) + "%",
          冷氣類銷售金額占比:
            ((data.冷氣類銷售金額占比 || 0) * 100).toFixed(2) + "%",
          去年獎金: Math.round(data.去年獎金 || 0),
          今年預測獎金: Math.round(data.預測獎金 || 0),
          董事長調整百分比: adjustmentPercentage,
          最終實發獎金: Math.round(finalBonus),
        };
      });
      const csv = Papa.unparse(csvData, { header: true, encoding: "utf-8" });
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      const now = new Date();
      const ts =
        now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        "_" +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0");
      const filename = `獎金分析結果_${ts}.csv`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      alert(
        `CSV檔案匯出成功！\n檔案名稱: ${filename}\n資料筆數: ${csvData.length} 筆`
      );
    } catch (e) {
      alert(`CSV匯出失敗: ${e.message}`);
    }
  };

  const prepareChartData = () => {
    if (!processedData)
      return { brandData: [], categoryData: [], bonusDistribution: [] };
    const brandData = [
      {
        name: "HERAN冷氣",
        value: Object.values(processedData).reduce(
          (s, c) => s + c.冷氣類HERAN銷售額,
          0
        ),
      },
      {
        name: "YAMADA冷氣",
        value: Object.values(processedData).reduce(
          (s, c) => s + c.冷氣類YAMADA銷售額,
          0
        ),
      },
      {
        name: "HERAN非冷氣",
        value: Object.values(processedData).reduce(
          (s, c) => s + c.非冷氣類HERAN銷售額,
          0
        ),
      },
      {
        name: "YAMADA非冷氣",
        value: Object.values(processedData).reduce(
          (s, c) => s + c.非冷氣類YAMADA銷售額,
          0
        ),
      },
      {
        name: "其他",
        value: Object.values(processedData).reduce(
          (s, c) => s + c.非冷氣類其他銷售額,
          0
        ),
      },
    ].filter((i) => i.value > 0);
    const categoryData = [
      {
        name: "冷氣類",
        value: Object.values(processedData).reduce(
          (s, c) => s + c.冷氣類銷售額,
          0
        ),
      },
      {
        name: "非冷氣類",
        value: Object.values(processedData).reduce(
          (s, c) => s + c.非冷氣類銷售額,
          0
        ),
      },
    ];
    const bonusDistribution = Object.keys(processedData)
      .map((code) => ({
        客戶: code.substring(0, 8),
        預測獎金: processedData[code].預測獎金,
        去年獎金: processedData[code].去年獎金,
      }))
      .sort((a, b) => b.預測獎金 - a.預測獎金)
      .slice(0, 20);
    return { brandData, categoryData, bonusDistribution };
  };

  const chartData = prepareChartData();
  const paginatedData = processedData
    ? Object.keys(processedData).slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];
  const totalPages = processedData
    ? Math.ceil(Object.keys(processedData).length / itemsPerPage)
    : 0;

  return (
    <div className="app">
      <style>{styles}</style>

      {/* 標題區域 */}
      <div className="header">
        <div className="container header-wrap">
          <h1 className="title">HERAN-Side Project</h1>
          <h2 className="subtitle">從數據到價值：AI 驅動的智能 KPI 洞察</h2>
          <p className="lead">
            運用機器學習技術，分析歷史銷售資料與獎金發放模式，為董事長提供智能化的獎金分配建議。系統將自動識別銷售特徵、計算關鍵指標，並預測最適當的獎金分配方案，大幅提升決策效率與準確性。
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
        {/* 檔案上傳區域 */}
        <div className="card">
          <h3 className="card-title">資料上傳</h3>
          <div className="grid grid-2">
            <div className="uploader">
              <Upload
                style={{ display: "block", margin: "0 auto 12px" }}
                size={48}
                color="#9CA3AF"
              />
              <h4>過往資料合併大表</h4>
              <p>上傳包含歷史獎金與銷售特徵的資料檔案</p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) =>
                  e.target.files &&
                  e.target.files[0] &&
                  handleFileUpload(e.target.files[0], "historical")
                }
                id="historical-upload"
                hidden
              />
              <label htmlFor="historical-upload" className="file-btn">
                選擇檔案
              </label>
              {historicalData && (
                <p className="ok">✓ 已上傳 ({historicalData.length} 筆記錄)</p>
              )}
            </div>

            <div className="uploader">
              <Upload
                style={{ display: "block", margin: "0 auto 12px" }}
                size={48}
                color="#9CA3AF"
              />
              <h4>最新年度銷售單據</h4>
              <p>上傳當年度的原始銷售交易資料</p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) =>
                  e.target.files &&
                  e.target.files[0] &&
                  handleFileUpload(e.target.files[0], "sales")
                }
                id="sales-upload"
                hidden
              />
              <label htmlFor="sales-upload" className="file-btn green">
                選擇檔案
              </label>
              {salesData && (
                <p className="ok">✓ 已上傳 ({salesData.length} 筆記錄)</p>
              )}
            </div>
          </div>

          <div className="center" style={{ marginTop: 20 }}>
            <button
              onClick={analyzeData}
              disabled={!historicalData || !salesData || isProcessing}
              className="primary-btn"
            >
              <Play size={20} />{" "}
              {isProcessing ? `分析中... ${progress}%` : "開始分析"}
            </button>
            <div className="hint">
              <p>
                歷史資料:{" "}
                {historicalData
                  ? `✓ 已上傳 (${historicalData.length} 筆)`
                  : "❌ 未上傳"}
              </p>
              <p>
                銷售資料:{" "}
                {salesData ? `✓ 已上傳 (${salesData.length} 筆)` : "❌ 未上傳"}
              </p>
              {(!historicalData || !salesData) && (
                <p className="error">請上傳兩個檔案後再開始分析</p>
              )}
            </div>
            {isProcessing && (
              <div style={{ marginTop: 12 }}>
                <div className="progress">
                  <div style={{ width: `${progress}%` }} />
                </div>
                <p className="progress-txt">正在處理... {progress}%</p>
              </div>
            )}
          </div>
        </div>

        {/* 概覽儀表板 */}
        {overview && (
          <div className="card">
            <h3 className="card-title">年度概覽</h3>
            <div className="kpis">
              <div className="kpi">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p className="label">年度總銷售額</p>
                    <p className="value">
                      ${(overview.totalSales / 1_000_000).toFixed(1)}M
                    </p>
                  </div>
                  <TrendingUp className="icon" size={32} color="#dbeafe" />
                </div>
              </div>
              <div className="kpi green">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p className="label">年度總毛利</p>
                    <p className="value">
                      ${(overview.totalGrossProfit / 1_000_000).toFixed(1)}M
                    </p>
                  </div>
                  <DollarSign className="icon" size={32} color="#dcfce7" />
                </div>
              </div>
              <div className="kpi purple">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p className="label">冷氣銷售數量</p>
                    <p className="value">
                      {overview.totalACQuantity.toLocaleString()}
                    </p>
                  </div>
                  <Package className="icon" size={32} color="#f3e8ff" />
                </div>
              </div>
              <div className="kpi orange">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p className="label">經銷商數量</p>
                    <p className="value">{overview.customerCount}</p>
                  </div>
                  <Users className="icon" size={32} color="#ffedd5" />
                </div>
              </div>
            </div>

            {/* 圖表 */}
            <div className="grid grid-2" style={{ marginBottom: 16 }}>
              <div className="chart">
                <h4>品牌銷售分布</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.brandData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.brandData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [
                        (v / 1_000_000).toFixed(1) + "M",
                        "銷售額",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart">
                <h4>產品類別分布</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                    />
                    <Tooltip
                      formatter={(v) => [
                        (v / 1_000_000).toFixed(1) + "M",
                        "銷售額",
                      ]}
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 總預算調整 */}
            <div className="budget">
              <h4>董事長年度獎金總額調整 (可選)</h4>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 260 }}>
                  <p className="hint">
                    系統建議總額:{" "}
                    <strong>
                      ${overview.totalPredictedBonus.toLocaleString()}
                    </strong>
                  </p>
                  <p className="hint" style={{ fontSize: 12, marginTop: 4 }}>
                    輸入期望總額後，系統會按照每個經銷商的原始比例重新分配獎金
                  </p>
                  <input
                    type="number"
                    placeholder="輸入期望的獎金總額"
                    value={adjustedTotalBudget}
                    onChange={(e) => setAdjustedTotalBudget(e.target.value)}
                    className="number"
                  />
                </div>
                <button
                  onClick={adjustTotalBudget}
                  disabled={!adjustedTotalBudget}
                  className="btn"
                >
                  按比例重新分配
                </button>
              </div>
              {adjustedTotalBudget && (
                <div className="preview">
                  <strong>預覽：</strong> 總額將從 $
                  {overview.totalPredictedBonus.toLocaleString()} 調整為 $
                  {parseFloat(adjustedTotalBudget || 0).toLocaleString()}{" "}
                  （調整比例：
                  {(
                    (parseFloat(adjustedTotalBudget || 0) /
                      overview.totalPredictedBonus) *
                    100
                  ).toFixed(1)}
                  %）
                </div>
              )}
            </div>
          </div>
        )}

        {/* 客戶細項表格 */}
        {processedData && (
          <div className="card">
            <div className="table-head">
              <h3 className="card-title" style={{ margin: 0 }}>
                經銷商獎金細項
              </h3>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button onClick={exportCSV} className="export">
                  <Download size={18} /> 匯出 CSV (
                  {Object.keys(processedData).length} 筆)
                </button>
                <div className="tip">💡 包含完整分析結果與最終獎金</div>
              </div>
            </div>

            {/* 獎金分布圖表 */}
            <div className="chart" style={{ marginBottom: 16 }}>
              <h4>TOP 20 經銷商獎金比較</h4>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.bonusDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="客戶"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v) => [v.toLocaleString(), ""]} />
                  <Bar dataKey="預測獎金" fill="#8884d8" name="今年預測" />
                  <Bar dataKey="去年獎金" fill="#82ca9d" name="去年實際" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 表格 */}
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>客戶代號</th>
                    <th className="right">去年實績</th>
                    <th className="right">今年實績</th>
                    <th className="center">業績狀況</th>
                    <th className="right">冷氣銷量</th>
                    <th className="right">HERAN冷氣</th>
                    <th className="right">YAMADA冷氣</th>
                    <th className="right">銷貨毛利額</th>
                    <th className="right">去年獎金</th>
                    <th className="right">今年預測獎金</th>
                    <th className="center">董事長加減區(%)</th>
                    <th className="right">最終實發獎金</th>
                  </tr>
                </thead>
                {/* --- CORRECTED CODE BLOCK START --- */}
                <tbody>
                  {paginatedData.map((customerCode) => {
                    const customer = processedData[customerCode];
                    const badgeClass = customer.業績狀況.includes("成長")
                      ? "badge green"
                      : customer.業績狀況.includes("衰退")
                      ? "badge red"
                      : "badge gray";
                    return (
                      <tr key={customerCode}>
                        <td>
                          <strong>{customerCode}</strong>
                        </td>
                        <td className="right">
                          ${Math.round(customer.去年實績).toLocaleString()}
                        </td>
                        <td className="right">
                          ${Math.round(customer.今年實績).toLocaleString()}
                        </td>
                        <td className="center">
                          <span className={badgeClass}>
                            {customer.業績狀況}
                          </span>
                        </td>
                        <td className="right">
                          {customer.冷氣類銷售數量.toLocaleString()}
                        </td>
                        <td className="right">
                          {customer.冷氣類HERAN銷售數量.toLocaleString()}
                        </td>
                        <td className="right">
                          {customer.冷氣類YAMADA銷售數量.toLocaleString()}
                        </td>
                        <td className="right">
                          ${Math.round(customer.總銷貨毛利額).toLocaleString()}
                        </td>
                        <td className="right">
                          ${Math.round(customer.去年獎金).toLocaleString()}
                        </td>
                        <td className="right">
                          ${Math.round(customer.預測獎金).toLocaleString()}
                        </td>
                        <td className="center">
                          <input
                            type="number"
                            step="1"
                            placeholder="0"
                            value={customerAdjustments[customerCode] || ""}
                            onChange={(e) =>
                              handleCustomerAdjustment(
                                customerCode,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="input"
                          />
                        </td>
                        <td className="right">
                          <strong>
                            $
                            {Math.round(
                              calculateFinalBonus(customerCode)
                            ).toLocaleString()}
                          </strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* --- CORRECTED CODE BLOCK END --- */}
              </table>
            </div>

            {/* 分頁 */}
            <div className="pager">
              <div className="meta">
                顯示 {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  Object.keys(processedData).length
                )}{" "}
                筆，共 {Object.keys(processedData).length} 筆記錄
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn"
                >
                  上一頁
                </button>
                <span className="page">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="btn"
                >
                  下一頁
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BonusPredictionDashboard;