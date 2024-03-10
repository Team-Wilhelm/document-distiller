using System.Text;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;

namespace VirtualFriend.Controller.Util;

public class Converter
{
    public string ConvertPdfToString(IFormFile file)
    {
        var reader = new PdfReader(file.OpenReadStream());
        var pdfDocument = new PdfDocument(reader);
        var stringBuilder = new StringBuilder();
        for (int page = 1; page <= pdfDocument.GetNumberOfPages(); page++)
        {
            var text = PdfTextExtractor.GetTextFromPage(pdfDocument.GetPage(page));
            stringBuilder.Append(text);
        }
        reader.Close();
        pdfDocument.Close();
        return stringBuilder.ToString();
    }
}