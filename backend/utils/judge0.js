const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  csharp: 51,
  go: 60
};

const normalizeOutput = (value) =>
  String(value ?? '')
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ');

const executeWithJudge0 = async ({ language, code, stdin }) => {
  const baseUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new Error(`Unsupported language: ${language}`);

  const headers = { 'Content-Type': 'application/json' };
  if (process.env.JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
    headers['X-RapidAPI-Host'] = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
  }

  const createRes = await fetch(`${baseUrl}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source_code: code,
      language_id: languageId,
      stdin: stdin || '',
      cpu_time_limit: 5,
      memory_limit: 128000
    })
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Judge0 error: ${errText}`);
  }

  const result = await createRes.json();
  const statusId = result.status?.id;
  const passed = statusId === 3;

  return {
    stdout: result.stdout || '',
    stderr: result.stderr || result.compile_output || '',
    time: result.time,
    memory: result.memory,
    status: passed ? 'success' : 'error',
    message: result.status?.description || ''
  };
};

const executeJavaScriptLocally = async (code, stdin) => {
  const logs = [];
  const mockConsole = {
    log: (...args) => logs.push(args.map(String).join(' '))
  };

  try {
    const fn = new Function('console', 'input', `${code}\n;return typeof solve === 'function' ? solve(input) : undefined;`);
    const input = stdin?.trim() || '';
    const returnValue = fn(mockConsole, input);
    const stdout = logs.length ? logs.join('\n') : returnValue !== undefined ? String(returnValue) : '';
    return { stdout, stderr: '', status: 'success', time: '0.01', memory: '1024' };
  } catch (error) {
    return { stdout: '', stderr: error.message, status: 'error', time: '0', memory: '0' };
  }
};

export const executeCode = async ({ language, code, stdin }) => {
  if (process.env.JUDGE0_API_URL || process.env.JUDGE0_API_KEY) {
    return executeWithJudge0({ language, code, stdin });
  }
  if (language === 'javascript') {
    return executeJavaScriptLocally(code, stdin);
  }
  return {
    stdout: '',
    stderr: `Configure JUDGE0_API_URL and JUDGE0_API_KEY in .env to run ${language} code.`,
    status: 'error',
    time: '0',
    memory: '0'
  };
};

export const runTestCases = async ({ language, code, testCases }) => {
  const results = [];
  let passedCount = 0;

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    const stdin = typeof test.input === 'string' ? test.input : JSON.stringify(test.input);
    const execution = await executeCode({ language, code, stdin });
    const actual = normalizeOutput(execution.stdout);
    const expected = normalizeOutput(test.expected);
    const passed = execution.status === 'success' && actual === expected;

    if (passed) passedCount += 1;
    results.push({
      index: i + 1,
      input: test.input,
      expected: test.expected,
      actual: execution.stdout,
      stderr: execution.stderr,
      passed,
      hidden: Boolean(test.hidden)
    });
  }

  return {
    results,
    passedCount,
    total: testCases.length,
    allPassed: passedCount === testCases.length
  };
};

export { LANGUAGE_IDS, normalizeOutput };
