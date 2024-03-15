import {DocumentResult} from "../models/document-result";

export default class DummyData {
  static getDocumentResult(): DocumentResult {
    return {
      id: "5b21a263-a137-4b80-83d3-28f4f818b116",
        projectId: "6b83c870-19a5-4dbc-a0e0-4504b02820ab",
        ownerId: "6b83c870-19a5-4dbc-a0e0-4504b02820ab",
        title: "Summary",
        createdAt: new Date("2024-03-15T09:01:10.766358Z"),
        lastModifiedAt: new Date("2024-03-15T09:01:10.766358Z"),
        fileName: "A-kasse.pdf",
        result: "Julia Ilasova has joined HK's A-Kass, one of Denmark's largest and experienced A-Kasas. Membership offers benefits such as unemployment benefits if unemployed, the opportunity to find a job through HK JobBørs, and expertise in the individual's field. However, membership is subject to certain conditions, including a minimum income of 280,210 Danish Krona per year, and a maximum of 5 years of free A-Kasing while under university. Changes in education or work status can affect the eligibility for benefits and the A-Kases.\r\n",
        discriminator: "DocumentSummary"
    } as DocumentResult;
  }

  static getDummyFile(): File {
    return new File([""], "dummy-file.txt");
  }
}
