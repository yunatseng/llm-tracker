import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { arch } from 'os';

// 取得當前檔案的目錄路徑 (ES 模組中的 __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API 端點
const apiEndpoints = [
  { arch: 'GPT', url: 'https://openrouter.ai/api/frontend/models/find?arch=GPT' },
  { arch: 'Claude', url: 'https://openrouter.ai/api/frontend/models/find?arch=Claude' },
  { arch: 'Gemini', url: 'https://openrouter.ai/api/frontend/models/find?arch=Gemini' },
  { arch: 'Grok', url: 'https://openrouter.ai/api/frontend/models/find?arch=Grok' },
  { arch: 'Llama', url:'https://openrouter.ai/api/frontend/models/find?arch=Llama4'},
  { arch: 'Mistral', url:'https://openrouter.ai/api/frontend/models/find?arch=Mistral'},
  { arch: 'Phi', url:'https://openrouter.ai/api/frontend/models/find?q=microsoft'},
  { arch: 'Nova', url:'https://openrouter.ai/api/frontend/models/find?arch=Nova'},
  { arch: 'Qwen', url:'https://openrouter.ai/api/frontend/models/find?arch=Qwen'},
  { arch: 'PaLM', url:'https://openrouter.ai/api/frontend/models/find?arch=Palm'}
];

// 發送 HTTP 請求的輔助函數
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'LLM-Tracker/1.0 (GitHub Actions)',
        'Accept': 'application/json'
      }
    }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// 主要抓取函數
async function fetchModels() {
  console.log('🚀 開始抓取 LLM 模型數據...');
  
  const allModels = [];
  const errors = [];
  
  for (const endpoint of apiEndpoints) {
    try {
      console.log(`📡 正在抓取 ${endpoint.arch} 模型...`);
      const response = await fetchData(endpoint.url);
      
      console.log(`📥 ${endpoint.arch} 回應結構:`, Object.keys(response));
      
      // 處理不同的回應結構
      let data = [];
      if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && response.data.models && Array.isArray(response.data.models)) {
        data = response.data.models;
      } else if (Array.isArray(response)) {
        data = response;
      } else if (response.models && Array.isArray(response.models)) {
        data = response.models;
      }
      
      console.log(`📊 ${endpoint.arch} 找到 ${data.length} 個模型`);
      
      if (data.length > 0) {
        data.forEach(model => {
          allModels.push({
            ...model,
            architecture: endpoint.arch,
            created: model.created || model.created_at || model.updated_at || new Date().toISOString(),
            displayName: model.name || model.short_name || model.id || 'Unknown Model',
            fetchedAt: new Date().toISOString()
          });
        });
        console.log(`✅ ${endpoint.arch}: 成功處理 ${data.length} 個模型`);
      } else {
        console.warn(`⚠️  ${endpoint.arch}: 沒有找到模型數據`);
      }
    } catch (error) {
      console.error(`❌ ${endpoint.arch}: ${error.message}`);
      errors.push({ architecture: endpoint.arch, error: error.message });
    }
  }
  
  // 按建立時間排序
  allModels.sort((a, b) => new Date(b.created) - new Date(a.created));
  
  // 建立輸出數據
  const outputData = {
    models: allModels,
    metadata: {
      totalModels: allModels.length,
      architectures: {
        GPT: allModels.filter(m => m.architecture === 'GPT').length,
        Claude: allModels.filter(m => m.architecture === 'Claude').length,
        Gemini: allModels.filter(m => m.architecture === 'Gemini').length
      },
      lastUpdated: new Date().toISOString(),
      errors: errors
    }
  };
  
  // 確保 public 目錄存在
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // 寫入 JSON 文件
  const outputPath = path.join(publicDir, 'models.json');
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
  
  console.log(`✨ 成功生成 models.json`);
  console.log(`📊 總計: ${allModels.length} 個模型`);
  console.log(`📁 文件位置: ${outputPath}`);
  
  if (errors.length > 0) {
    console.warn(`⚠️  遇到 ${errors.length} 個錯誤:`);
    errors.forEach(err => console.warn(`   - ${err.architecture}: ${err.error}`));
  }
}

// 執行抓取
fetchModels().catch(error => {
  console.error('💥 抓取過程中發生嚴重錯誤:', error);
  process.exit(1);
});
