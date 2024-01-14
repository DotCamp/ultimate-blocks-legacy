import AceEditor from "react-ace";
// import "brace/mode/css";
// import "brace/mode/javascript";
// import "brace/snippets/css";
// import "brace/snippets/javascript";
// import "brace/snippets/text";
// import "brace/ext/language_tools";
// import "brace/theme/monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-snippets";
import "ace-builds/src-noconflict/snippets/css";

function CodeEditor(props) {
	return (
		<div style={{ height: 400 }} className="ub-code-editor-component">
			<AceEditor
				theme="solarized_light"
				onLoad={(editor) => {
					editor.renderer.setScrollMargin(16, 16, 16, 16);
				}}
				fontSize={12}
				showPrintMargin
				showGutter={true}
				highlightActiveLine={true}
				width="100%"
				height="100%"
				setOptions={{
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: true,
					enableSnippets: true,
					showLineNumbers: true,
					printMargin: false,
					tabSize: 2,
				}}
				editorProps={{
					$blockScrolling: Infinity,
				}}
				{...props}
			/>
		</div>
	);
}

export default CodeEditor;
