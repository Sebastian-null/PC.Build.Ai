import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/request.ts");

export default withNextIntl({
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: true,
});
