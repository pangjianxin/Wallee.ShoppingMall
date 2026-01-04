using System.IO;
using System.Linq;

namespace Wallee.Mall.Medias;

public static class MediaChecks
{
    public static bool IsValidMediaFileName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return false;
        }

        return !Path.GetInvalidFileNameChars().Any(name.Contains);
    }
}
