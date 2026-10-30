export const config = { runtime: 'edge' };

const GITHUB_BASE_URL = "https://github.com/monster192/Launcher-Cdn/releases/download/Cdn";

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json"
    };

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 1. Защита от пустых файлов
    if (path.includes("date_marker") || path.endsWith(".marker")) {
      return new Response("", { status: 200, headers: { "Content-Type": "application/octet-stream", "Access-Control-Allow-Origin": "*" } });
    }

    // 2. Список серверов (тут твой IP, его не трогаем)
    if (path.includes("servers.json")) {
      return new Response(JSON.stringify([
        { "id": 1, "status": "", "online": 0, "maxonline": 100, "color": "000000", "x2": false, "key": "1424", "name": "Monster RP", "firstname": "Monster", "secondname": "RP", "url": "185.207.214.14", "ip": "185.207.214.14", "port": 6057 }
      ]), { status: 200, headers: corsHeaders });
    }

    // 3. Конфиг ссылок (Здесь заменен домен на твой Vercel)
    if (path.includes("url-config.json")) {
      return new Response(JSON.stringify([
        { 
          "region": "CIS", 
          "cdnUrl": "https://varcelcdn.vercel.app", 
          "cdnBackupUrl": "https://varcelcdn.vercel.app", 
          "apiUrl": "https://varcelcdn.vercel.app", 
          "apiBackupUrl": "https://varcelcdn.vercel.app", 
          "apiUsername": "main", 
          "apiBackupUsername": "main", 
          "apiPassword": "DzEI304VDpdc6KpcSfd3", 
          "apiBackupPassword": "DzEI304VDpdc6KpcSfd3", 
          "donateUrl": "https://varcelcdn.vercel.app", 
          "paymentMarketVerificationUrl": "https://varcelcdn.vercel.app", 
          "paymentRustoreVerificationUrl": "https://varcelcdn.vercel.app" 
        }
      ]), { status: 200, headers: corsHeaders });
    }

    // 4. Флаги (Отключено)
    if (path.includes("update_manager_feature_flag.json")) {
      return new Response(JSON.stringify({ 
        "ab_test": {}, "candidateVersions": [], "isEnabledCheckResources": false, "forceCheckResources": false, "typeDownloadResources": "primary",
        "version": 1, "minVersion": 1, "updateType": 1, "type": 1, "code": 200, "status": 1, "isEnabled": true
      }), { status: 200, headers: corsHeaders });
    }

    // 5.1. Candidate (Отдаем пустой объект)
    if (path.includes("patch_index_candidate")) {
      return new Response("{}", { status: 200, headers: corsHeaders });
    }

    // 5.2. Основной patch_index
    if (path.includes("patch_index")) {
      const githubUrl = `${GITHUB_BASE_URL}/patch_index.json`; 
      const res = await fetch(githubUrl);
      if (!res.ok) return new Response("Not Found", { status: 404, headers: corsHeaders });
      return new Response(res.body, { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }

    // 5.3. Файлы игры
    if (method === "GET" || method === "HEAD") {
      if (path.includes("/files/") || path.includes("jsons/") || path.endsWith(".bpc") || path.endsWith(".zip") || path.endsWith(".tmb")) {
        let fileName = path.substring(path.lastIndexOf('/') + 1);
        if (path.includes("/en/") && fileName === "client-jsons.zip") fileName = "en_client-jsons.zip";
        else if (path.includes("/pt-br/") && fileName === "client-jsons.zip") fileName = "pt-br_client-jsons.zip";

        const githubUrl = `${GITHUB_BASE_URL}/${fileName}`;
        const response = await fetch(githubUrl);
        if (!response.ok) return new Response(`File not found`, { status: 404, headers: corsHeaders });
        
        return new Response(method === "HEAD" ? null : response.body, { 
          status: 200, 
          headers: { "Content-Type": "application/octet-stream", "Access-Control-Allow-Origin": "*" } 
        });
      }
    }

    // 6. Заглушка для API
    const mockApiResponse = {
      "status": "success", "code": 200, "message": "OK", "version": 1, "minVersion": 1, "type": 1,
      "data": { "token": "test_token_12345", "access_token": "test_token_12345", "user_id": 1, "id": 1, "version": 1, "minVersion": 1, "type": 1, "nickname": "Andrey_Monster", "balance": 999999, "servers": [{ "id": 1, "name": "Monster RP", "ip": "185.207.214.14", "port": 6057 }] }
    };

    return new Response(JSON.stringify(mockApiResponse), { status: 200, headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
        }
