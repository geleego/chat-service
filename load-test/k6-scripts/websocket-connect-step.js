import ws from 'k6/ws';
import { check } from 'k6';

// ====== STEP 1: 스모크 테스트 (10명) ======
export const smokeTest = {
  vus: 10,
  duration: '30s',
  thresholds: {
    'ws_connecting': ['p(95)<100'], // 95%가 0.1초 이내
    'checks': ['rate>0.95'],        // 95% 이상 성공
  }
};

// ====== STEP 2: 기본 부하 테스트 (100명) ======
export const loadTest = {
  stages: [
    { duration: '30s', target: 50 },   // 30초 동안 50명까지
    { duration: '30s', target: 100 },  // 30초 동안 100명까지
    { duration: '1m', target: 100 },   // 1분 동안 100명 유지
    { duration: '30s', target: 0 },    // 30초 동안 0명으로
  ],
  thresholds: {
    'ws_connecting': ['p(95)<200'],  // 95%가 0.2초 이내
    'checks': ['rate>0.95'],         // 95% 이상 성공
  }
};

// ====== STEP 3: 스트레스 테스트 (500명) ======
export const stressTest = {
  stages: [
    { duration: '1m', target: 100 },   // 1분 동안 100명
    { duration: '1m', target: 200 },   // 1분 동안 200명
    { duration: '1m', target: 300 },   // 1분 동안 300명
    { duration: '1m', target: 400 },   // 1분 동안 400명
    { duration: '2m', target: 500 },   // 2분 동안 500명 유지
    { duration: '1m', target: 0 },     // 1분 동안 0명으로
  ],
  thresholds: {
    'ws_connecting': ['p(95)<500'],  // 95%가 0.5초 이내
    'checks': ['rate>0.90'],         // 90% 이상 성공
  }
};

// ====== STEP 4: 스파이크 테스트 (1000명 급증) ======
export const spikeTest = {
  stages: [
    { duration: '30s', target: 100 },   // 30초 동안 100명
    { duration: '10s', target: 1000 },  // 10초 만에 1000명 (급증!)
    { duration: '1m', target: 1000 },   // 1분 동안 1000명 유지
    { duration: '10s', target: 100 },   // 10초 만에 100명으로
    { duration: '30s', target: 0 },     // 30초 동안 0명으로
  ],
  thresholds: {
    'ws_connecting': ['p(95)<1000'],  // 95%가 1초 이내
    'checks': ['rate>0.80'],          // 80% 이상 성공
  }
};

// ====== STEP 5: 내구성 테스트 (2000명 장시간) ======
export const soakTest = {
  stages: [
    { duration: '5m', target: 2000 },   // 5분 동안 2000명까지
    { duration: '30m', target: 2000 },  // 30분 동안 2000명 유지
    { duration: '5m', target: 0 },      // 5분 동안 0명으로
  ],
  thresholds: {
    'ws_connecting': ['p(95)<1000'],  // 95%가 1초 이내 연결
    'checks': ['rate>0.90'],          // 90% 이상 성공
  }
};

// ====== STEP 6: 최대 부하 테스트 (5000명) ======
export const maxLoadTest = {
  stages: [
    { duration: '1m', target: 1000 },
    { duration: '1m', target: 2000 },
    { duration: '1m', target: 3000 },
    { duration: '1m', target: 4000 },
    { duration: '1m', target: 5000 },
    { duration: '1m', target: 5000 },   // 유지
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    'ws_connecting': ['p(95)<2000'],   // 95%가 2초 이내 연결
    'checks': ['rate>0.80'],           // 80% 이상 WebSocket 연결 성공
  }
};

// // ====== STEP 7: 극한 테스트 (10000명) ======
// export const extremeTest = {
//   stages: [
//     { duration: '30s', target: 2000 },
//     { duration: '30s', target: 4000 },
//     { duration: '30s', target: 6000 },
//     { duration: '30s', target: 8000 },
//     { duration: '30s', target: 10000 },
//     { duration: '30s', target: 10000 }, // 유지
//     { duration: '30s', target: 0 },
//   ],
//   thresholds: {
//     'ws_connecting': ['p(95)<3000'],   // 95%가 3초 이내 연결
//     'checks': ['rate>0.70'],           // 70% 이상 성공
//   }
// };

// ====== 50,000명 ======
export const extremeTest = {
  stages: [
    { duration: '30s', target: 5000 },  // 점진적 증가
    { duration: '30s', target: 10000 },
    { duration: '30s', target: 20000 },
    { duration: '30s', target: 30000 },
    { duration: '30s', target: 40000 },
    { duration: '30s', target: 50000 }, // ramp-up
    { duration: '30s', target: 50000 }, // 유지
    { duration: '30s', target: 0 },     // ramp-down
  ],
  thresholds: {
    'ws_connecting': ['p(95)<3000'],   // 99%가 3초 이내 연결
    'checks': ['rate>0.70'],           // 99% 이상 성공
  }
};

// ====== 실행할 테스트 선택 ======
// export const options = smokeTest;
// export const options = loadTest;
// export const options = stressTest;
// export const options = spikeTest;
// export const options = soakTest;
// export const options = maxLoadTest;
export const options = extremeTest;

const STOMP_URL = 'ws://localhost:8080/connect/websocket';

export default function () {
  const res = ws.connect(STOMP_URL, {}, function (socket) {
    socket.on('open', () => {
      console.log(`VU ${__VU}: 연결 성공`);
    });

    socket.on('error', (e) => {
      console.error(`VU ${__VU}: 에러 - ${e}`);
    });
  });
  
  // WebSocket 연결 체크
  check(res, {
    'WebSocket 연결 성공': (r) => r && r.status === 101,
  });
}