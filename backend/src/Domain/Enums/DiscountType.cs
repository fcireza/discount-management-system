    using System.Text.Json.Serialization;
    using System.Runtime.Serialization;

    namespace backend.src.domain.Enums{
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum DiscountType
        {
            [EnumMember(Value = "percentage")]
            PercentageDiscount,
            [EnumMember(Value = "fixedAmount")]
            FixedAmountDiscount,
            [EnumMember(Value = "twoForOne")]
            TwoForOneDiscount
        }
    }