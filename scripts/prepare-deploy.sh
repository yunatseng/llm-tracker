#!/bin/bash

# 部署後處理腳本
echo "🚀 準備部署文件..."

# 確保 dist 目錄存在
if [ ! -d "dist" ]; then
  echo "❌ dist 目錄不存在，請先運行 npm run build"
  exit 1
fi

# 複製 models.json 到 dist 目錄
if [ -f "public/models.json" ]; then
  cp public/models.json dist/models.json
  echo "✅ 已複製 models.json 到 dist 目錄"
else
  echo "⚠️  models.json 不存在，將使用空數據"
  echo '{"models":[],"metadata":{"totalModels":0,"architectures":{"GPT":0,"Claude":0,"Gemini":0},"lastUpdated":"'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'","errors":[]}}' >dist/models.json
fi

# 複製 .nojekyll 文件
cp public/.nojekyll dist/.nojekyll
echo "✅ 已複製 .nojekyll 文件"

echo "🎉 部署文件準備完成！"
