import React, { Suspense } from 'react';
import "./i18n";

const LanguageProvider = ({ children }) => (
  <Suspense fallback={<div>Loading...</div>}>
    {children}
  </Suspense>
);

export default LanguageProvider;
