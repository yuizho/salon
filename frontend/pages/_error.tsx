import NextErrorComponent from 'next/error';
import { NextPageContext } from 'next';

const ErrorPage = ({ statusCode }: { statusCode: number }) => {
  return <NextErrorComponent statusCode={statusCode} />;
};

ErrorPage.getInitialProps = async (context: NextPageContext) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(context);
  return errorInitialProps;
};

export default ErrorPage;
