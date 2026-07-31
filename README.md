# CogniSage

> 面向 C/C++ 的主动验证式智能漏洞检测系统。

CogniSage 将静态规则、Joern/CPG、跨文件上下文、世界模型状态推演、LLM 语义复核及 ASan/UBSan/定向 fuzz 验证串联为同一条证据链。目标不是堆叠告警，而是让每个高风险结论都能回到具体的 Source、Sink、触发路径与运行时观测。

## 在线演示

- [产品介绍页](https://caoyueran.github.io/CogniSage/)
- [控制台演示页](https://caoyueran.github.io/CogniSage/console/)

GitHub Pages 是静态展示环境。真实扫描、文件上传、LLM 调用、Source/Sink 定位及运行时验证需要在本机控制台运行。

## 核心能力

- C/C++ 双链路漏洞检测，覆盖内存安全、越界、UAF、空指针、命令注入、路径风险等 CWE。
- 仓库图与跨文件候选：按文件、函数和调用路径压缩上下文。
- 世界模型：推演 Candidate、Triggerable、Confirmed 等状态，并在验证预算内选择下一步动作。
- 真实验证：按 CWE 生成局部 harness，接入 ASan、UBSan 与 directed fuzz。
- 可审阅证据：控制台展示 CWE 分布、LLM Token、Source/Sink 代码定位与高亮上下文。

## 本机运行

完整可移植部署包位于 `release/CogniSage-source/`，包含运行权重和详细的 [运行说明](RUNNING.txt)。

```powershell
Set-Location .\release\CogniSage-source
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e .
python -m pip install -r requirements.txt

Set-Location .\console\web
npm install
npm run build
Set-Location ..\..

.\.venv\Scripts\python.exe -m uvicorn console.server:app --host 127.0.0.1 --port 8787
```

打开 `http://127.0.0.1:8787/`，拖入 C/C++ 源码或输入本地项目路径后即可发起扫描。

## 架构

```text
Repository / CPG
  -> Static Agent Cluster
  -> Repo Context + World Model Roll-out
  -> LLM Validation (only when evidence is insufficient)
  -> ASan / UBSan / Directed Fuzz
  -> Evidence Report + Source/Sink Locator
```

## 说明

- `cognisage` 是最新部署包的 Python 包名与 CLI 名称。
- 根目录现有 `vulnsage/` 是兼容开发源码，迁移包已完成运行标识替换并可独立运行。
- LLM API Key 仅应保存在本机配置中，禁止提交到仓库。
