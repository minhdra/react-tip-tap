
# UI for Tiptap ReactJS 

This is a personal project, this support use basically rich editor (tiptap)

## Tech Stack

ReactJS, Typescript, AntD, Tiptap

## Usage/Examples

```typescript
import { TipEditor } from '@minhdra/react-tip-tap';

function App() {
  return <TipEditor />
}
```

## Variable Reference

| Variable             | Description                                                     |
| ----------------- | ------------------------------------------------------------------ |
| value | Value of editor, use it if you not use form instance |
| onChange | Change event of value |
| error | Validator for editor, recommend use useWatch hook |
| disabled | Disable editor |
| tableResize | Allow resize table node, default is true |
| handleUploadImage | This function to upload image to your server. If you not, default using base64 |
| deleteFile | This function to handle delete file from you uploaded |
