import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  userFirstname?: string;
  verificationUrl?: string;
}

export const VerificationEmail = ({
  userFirstname = "",
  verificationUrl = "",
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for genit</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify your email address</Heading>
          <Text style={text}>Hi {userFirstname},</Text>
          <Text style={text}>
            Thanks for signing up for genit! Please verify your email address by
            clicking the button below:
          </Text>
          <Link href={verificationUrl} style={button}>
            Verify Email Address
          </Link>
          <Text style={text}>
            If you didn't create an account with genit, you can safely ignore
            this email.
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            The genit Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "14px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  margin: "20px 0",
};

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};
