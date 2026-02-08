namespace backend.src.application.DTOs;
using backend.src.domain.Enums;
using System.Text.Json.Serialization;
public class CreateDiscountDto
{
    public string Name { get; set; } = string.Empty;

    [JsonConverter(typeof(JsonStringEnumConverter<DiscountType>))]
    public DiscountType Type { get; set; }

    // Solo se usan según el tipo
    public float? Percentage { get; set; }
    public float? Amount { get; set; }
}
