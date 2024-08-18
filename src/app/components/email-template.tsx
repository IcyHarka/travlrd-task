import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  visitors: string;
  conversion_rate: number;
  optimized_conversion: number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  phone,
  website,
  industry,
  visitors,
  conversion_rate,
  optimized_conversion,
}) => (
  <div>
    <h3>Name: {name}</h3>
    <h3>Email: {email}</h3>
    <h3>Phone: {phone}</h3>
    <h3>Website: {website} </h3>
    <h3>Industry: {industry}</h3>
    <h3>Visitors: {visitors}</h3>
    <h3>Conversion Rate: {conversion_rate}</h3>
    <h3>Optimized Conversion:{optimized_conversion} </h3>
  </div>
);
