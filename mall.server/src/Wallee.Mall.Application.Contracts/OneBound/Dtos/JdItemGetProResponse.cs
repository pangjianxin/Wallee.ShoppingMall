using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Wallee.Mall.OneBound.Dtos;

public sealed class JdItemGetProResponse
{
    [JsonPropertyName("item")]
    public JdItemGetProItem? Item { get; set; }

    [JsonPropertyName("secache")]
    public string? Secache { get; set; }

    [JsonPropertyName("secache_time")]
    public long? SecacheTime { get; set; }

    [JsonPropertyName("secache_date")]
    public string? SecacheDate { get; set; }

    [JsonPropertyName("translate_status")]
    public string? TranslateStatus { get; set; }

    [JsonPropertyName("translate_time")]
    public int? TranslateTime { get; set; }

    [JsonPropertyName("language")]
    public OneboundLanguageInfo? Language { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }

    [JsonPropertyName("reason")]
    public string? Reason { get; set; }

    [JsonPropertyName("error_code")]
    public string? ErrorCode { get; set; }

    [JsonPropertyName("cache")]
    public int? Cache { get; set; }

    [JsonPropertyName("api_info")]
    public string? ApiInfo { get; set; }

    [JsonPropertyName("execution_time")]
    public string? ExecutionTime { get; set; }

    [JsonPropertyName("server_time")]
    public string? ServerTime { get; set; }

    [JsonPropertyName("client_ip")]
    public string? ClientIp { get; set; }

    [JsonPropertyName("call_args")]
    public List<string>? CallArgs { get; set; }

    [JsonPropertyName("api_type")]
    public string? ApiType { get; set; }

    [JsonPropertyName("translate_language")]
    public string? TranslateLanguage { get; set; }

    [JsonPropertyName("translate_engine")]
    public string? TranslateEngine { get; set; }

    [JsonPropertyName("server_memory")]
    public string? ServerMemory { get; set; }

    [JsonPropertyName("request_id")]
    public string? RequestId { get; set; }

    [JsonPropertyName("last_id")]
    public string? LastId { get; set; }
}

public sealed class OneboundLanguageInfo
{
    [JsonPropertyName("default_lang")]
    public string? DefaultLang { get; set; }

    [JsonPropertyName("current_lang")]
    public string? CurrentLang { get; set; }
}

public sealed class JdItemGetProItem
{
    [JsonPropertyName("num_iid")]
    public string? NumIid { get; set; }

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("desc_short")]
    public string? DescShort { get; set; }

    [JsonPropertyName("price")]
    public string? Price { get; set; }

    [JsonPropertyName("total_price")]
    public string? TotalPrice { get; set; }

    [JsonPropertyName("suggestive_price")]
    public string? SuggestivePrice { get; set; }

    [JsonPropertyName("orginal_price")]
    public string? OrginalPrice { get; set; }

    [JsonPropertyName("nick")]
    public string? Nick { get; set; }

    [JsonPropertyName("num")]
    public int? Num { get; set; }

    [JsonPropertyName("min_num")]
    public int? MinNum { get; set; }

    [JsonPropertyName("detail_url")]
    public string? DetailUrl { get; set; }

    [JsonPropertyName("pic_url")]
    public string? PicUrl { get; set; }

    [JsonPropertyName("brand")]
    public string? Brand { get; set; }

    [JsonPropertyName("brandId")]
    public string? BrandId { get; set; }

    [JsonPropertyName("rootCatId")]
    public string? RootCatId { get; set; }

    [JsonPropertyName("cid")]
    public string? Cid { get; set; }

    [JsonPropertyName("desc")]
    public string? Desc { get; set; }

    [JsonPropertyName("desc_img")]
    public string? DescImg { get; set; }

    [JsonPropertyName("item_imgs")]
    public JdItemImagesContainer? ItemImgs { get; set; }

    [JsonPropertyName("item_weight")]
    public string? ItemWeight { get; set; }

    [JsonPropertyName("location")]
    public string? Location { get; set; }

    [JsonPropertyName("post_fee")]
    public string? PostFee { get; set; }

    [JsonPropertyName("express_fee")]
    public string? ExpressFee { get; set; }

    [JsonPropertyName("ems_fee")]
    public string? EmsFee { get; set; }

    [JsonPropertyName("video_id")]
    public string? VideoId { get; set; }

    [JsonPropertyName("is_promotion")]
    public string? IsPromotion { get; set; }

    [JsonPropertyName("props_name")]
    public string? PropsName { get; set; }

    [JsonPropertyName("prop_imgs")]
    public JdPropImagesContainer? PropImgs { get; set; }

    [JsonPropertyName("property_alias")]
    public string? PropertyAlias { get; set; }

    [JsonPropertyName("props")]
    public List<object>? Props { get; set; }

    [JsonPropertyName("total_sold")]
    public string? TotalSold { get; set; }

    [JsonPropertyName("skus")]
    public JdSkusContainer? Skus { get; set; }

    [JsonPropertyName("seller_id")]
    public string? SellerId { get; set; }

    [JsonPropertyName("sales")]
    public string? Sales { get; set; }

    [JsonPropertyName("shop_id")]
    public string? ShopId { get; set; }

    [JsonPropertyName("props_list")]
    public Dictionary<string, string>? PropsList { get; set; }

    [JsonPropertyName("seller_info")]
    public JdSellerInfo? SellerInfo { get; set; }

    [JsonPropertyName("props_img")]
    public Dictionary<string, string>? PropsImg { get; set; }

    [JsonPropertyName("_ddf")]
    public string? Ddf { get; set; }

    [JsonPropertyName("shop_item")]
    public List<object>? ShopItem { get; set; }

    [JsonPropertyName("relate_items")]
    public List<object>? RelateItems { get; set; }
}

public sealed class JdItemImagesContainer
{
    [JsonPropertyName("item_img")]
    public List<JdImage>? ItemImg { get; set; }
}

public sealed class JdPropImagesContainer
{
    [JsonPropertyName("prop_img")]
    public List<JdPropImage>? PropImg { get; set; }
}

public sealed class JdImage
{
    [JsonPropertyName("url")]
    public string? Url { get; set; }
}

public sealed class JdPropImage
{
    [JsonPropertyName("properties")]
    public string? Properties { get; set; }

    [JsonPropertyName("url")]
    public string? Url { get; set; }
}

public sealed class JdSkusContainer
{
    [JsonPropertyName("sku")]
    public List<JdSku>? Sku { get; set; }
}

public sealed class JdSku
{
    [JsonPropertyName("price")]
    public string? Price { get; set; }

    [JsonPropertyName("orginal_price")]
    public string? OrginalPrice { get; set; }

    [JsonPropertyName("properties")]
    public string? Properties { get; set; }

    [JsonPropertyName("properties_name")]
    public string? PropertiesName { get; set; }

    [JsonPropertyName("quantity")]
    public string? Quantity { get; set; }

    [JsonPropertyName("sku_id")]
    public string? SkuId { get; set; }

    [JsonPropertyName("sku_url")]
    public string? SkuUrl { get; set; }
}

public sealed class JdSellerInfo
{
    [JsonPropertyName("shop_id")]
    public long? ShopId { get; set; }

    [JsonPropertyName("zhuy")]
    public string? Zhuy { get; set; }

    [JsonPropertyName("nick")]
    public string? Nick { get; set; }

    [JsonPropertyName("shop_name")]
    public string? ShopName { get; set; }
}
