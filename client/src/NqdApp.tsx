import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NqdHomePage } from './pages/NqdHomePage';

export default function NqdApp() {
  return <BrowserRouter><Routes><Route path="/" element={<NqdHomePage />} /></Routes></BrowserRouter>;
}
