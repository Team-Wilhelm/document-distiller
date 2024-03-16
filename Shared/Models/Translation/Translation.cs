namespace Shared.Models;

public class DetectedLanguage
{
    public string Language { get; set; }
    public double Score { get; set; }
}

public class Translation
{
    public string Text { get; set; }
    public string To { get; set; }
}

public class TranslatorResponse
{
    public DetectedLanguage DetectedLanguage { get; set; }
    public List<Translation> Translations { get; set; }
}

public class TranslationSelection
{
    public string Code { get; set; }
    public string Name { get; set; }
}