using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;

namespace Application.DTOs.DiscountResponseDto;

public class DiscountResponseDto
{
    public Guid discountId { get; set; }
    public float originalTotal { get; set; }
    public float finalTotal { get; set; }
    public float discountedApplied { get; set; }
}