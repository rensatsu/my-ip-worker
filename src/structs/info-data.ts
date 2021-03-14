import { getName } from "country-list";

/**
 * IP Infodata interface.
 *
 * @interface InfodataInterface
 */
interface InfodataInterface {
  ip?: string | null;
  country?: string | null;
  countryCode?: string | null;
  asn?: number | null;
  isp?: string | null;
  userAgent?: string | null;
}

/**
 * IP Infodata Class.
 *
 * @class Infodata
 */
class Infodata {
  private data: InfodataInterface;

  /**
   * Creates an instance of Infodata.
   * @param {InfodataInterface} data
   * @memberof Infodata
   */
  constructor(data: InfodataInterface) {
    this.data = data;

    if (data.countryCode?.length === 2) {
      this.data.country = getName(data.countryCode.toUpperCase());
    }
  }

  get ip() {
    return this.data.ip;
  }

  get country() {
    return this.data.country;
  }

  get countryCode() {
    return this.data.countryCode;
  }

  get asn() {
    return this.data.asn;
  }

  get isp() {
    return this.data.isp;
  }

  get userAgent() {
    return this.data.userAgent;
  }

  /**
   * Return JSON data.
   *
   * @returns {object}
   * @memberof Infodata
   */
  toJson() {
    return {
      ip: this.data.ip,
      country: this.data.country,
      countryCode: this.data.countryCode,
      asn: this.data.asn,
      isp: this.data.isp,
      userAgent: this.data.userAgent,
    };
  }
}

export { Infodata, InfodataInterface };
