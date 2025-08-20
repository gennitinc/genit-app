import React from "react";
export type AuthTypes = {
  username?: string;
  email: string;
  password?: string;
  userdp?: string;
};

export type RegexType = {
  fieldname: string;
  regex: RegExp;
  value: string;
  errormsg: string;
};

export type OnboardingTypes = {
  businessname: string;
  businessemail: string;
  companywebsite: string;
  businessbio: string;
  businessimage: React.ImgHTMLAttributes<HTMLImageElement>;
};


