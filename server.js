const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_ID = 'S_DESIAN_GM';
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'https://skt.binzary.com:9931/v1/guidance/location/search';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search', async (req, res) => {
  const plateNo = String(req.query.plateNo || '').trim();

  if (!/^\d{4}$/.test(plateNo)) {
    return res.status(400).json({
      message: '차량번호 뒤 4자리를 숫자로 입력해주세요.'
    });
  }

  const url = new URL(EXTERNAL_API_URL);
  url.searchParams.set('siteId', SITE_ID);
  url.searchParams.set('plateNo', plateNo);

  console.log(`[parking-search] request ${url.toString()}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    });

    console.log(`[parking-search] response ${response.status} ${url.toString()}`);

    const contentType = response.headers.get('content-type') || '';
    const bodyText = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        message: '외부 주차 위치 검색 API에서 오류가 발생했습니다.',
        status: response.status
      });
    }

    if (!contentType.includes('application/json')) {
      return res.status(502).json({
        message: '외부 API 응답 형식이 올바르지 않습니다.'
      });
    }

    res.type('application/json').send(bodyText);
  } catch (error) {
    console.error(`[parking-search] error ${error.message}`);
    res.status(502).json({
      message: '외부 주차 위치 검색 API에 연결할 수 없습니다.',
      detail: error.message
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Parking auto-search MVP is running at http://localhost:${PORT}`);
});
