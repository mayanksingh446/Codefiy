import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import Markdown from "react-markdown";
import { HashLoader } from "react-spinners";

const App = () => {
  const options = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "php", label: "PHP" },
    { value: "rust", label: "Rust" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
  ];

  const darkStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#18181b", // zinc-900
      borderColor: "#27272a",
      color: "white",
      width: "100%",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#18181b",
      width: "100%",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#9333ea" : "#18181b",
      color: "white",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
      width: "100%",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#a1a1aa",
      width: "100%",
    }),
  };

  const [code, setCode] = useState("");
  const [Loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");


  async function reviewCode() {
    setResponse("");
    setLoading(true);
    try {
      const res = await fetch("https://codefiy-backend.onrender.com/review", {
        method: POST,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language: selectvalue.value,
        }),
      });

      const data = await res.json();
      setResponse(data.result);

      setResponse(response.text);
      setLoading(false);
    } catch (error) {
      setResponse("Error reviewing code.");
    } finally {
      setLoading(false);
    }
  }

  async function fixCode() {
  if (!code) return alert("Please enter code first");

  setLoading(true);

  try {
    const res = await fetch("https://codefiy-backend.onrender.com/fix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language: selectvalue.value,
      }),
    });

    const data = await res.json();

    // Replace editor code with fixed version
    setCode(data.result);
  } catch (error) {
    alert("Error fixing code");
  } finally {
    setLoading(false);
  }
}

  const [selectvalue, setSelectvalue] = useState(options[0]);

  return (
    <>
      <Navbar />
      <div
        className="main flex justify-between ml-2 "
        style={{ height: "calc(100vh - 90px)" }}
      >
        <div className="left h-[86%] w-[50%]">
          <div className="tabs !p-2 w-full flex items-center gap-[10px]">
            <Select
              value={selectvalue}
              onChange={(e) => {
                setSelectvalue(e);
              }}
              options={options}
              styles={darkStyles}
            />
            <button onClick={()=>{
              fixCode()
            }} className="btnNormal bg-zinc-900 min-w-[120px] transition-all hover:bg-zinc-800">
              Fix code
            </button>
            <button
              onClick={() => {
                if (code === "") {
                  alert("Please enter code first");
                } else {
                  reviewCode();
                }
              }}
              className=" btnNormal bg-zinc-900 min-w-[120px] transition-all hover:bg-zinc-800"
            >
              Review
            </button>
          </div>
          <Editor
            height="104%"
            language={selectvalue.value}
            value={code}
            theme="custom-dark"
            beforeMount={(monaco) => {
              monaco.editor.defineTheme("custom-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [
                  { token: "keyword", foreground: "3B82F6" }, // blue
                  { token: "string", foreground: "22C55E" }, // green
                  { token: "number", foreground: "F59E0B" }, // orange
                  {
                    token: "comment",
                    foreground: "6B7280",
                    fontStyle: "italic",
                  },
                ],
                colors: {
                  "editor.background": "#18181b",
                },
              });
            }}
            onChange={(value) => setCode(value || "")}
          />
        </div>
        <div className="right overflow-auto !p-[10px] bg-zinc-900 w-[50%] h-full">
          <div className="tabs border-b-[1px] border-t-[1px] border-[#27272a] flex items-center justify-between h-[60px]">
            <p className="font-[700] text-[17px]">Response </p>
          </div>
          {Loading && <HashLoader color="blue" size={100} />}
          <Markdown>{response}</Markdown>
        </div>
      </div>
    </>
  );
};

export default App;
