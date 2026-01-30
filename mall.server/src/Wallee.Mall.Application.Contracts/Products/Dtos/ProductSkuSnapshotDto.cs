namespace Wallee.Mall.Products.Dtos
{
    public class ProductSkuSnapshotDto
    {
        /// <summary>
        /// 京东商品的SKUID
        /// </summary>
        public string JdSkuId { get; set; } = default!;
        /// <summary>
        /// 京东参考价（仅用于展示/比价，不参与系统销售价计算）。
        /// </summary>
        public decimal? JdPrice { get; set; }
        /// <summary>
        /// 商品原价格（可被 SKU 覆盖）
        /// </summary>
        public decimal OriginalPrice { get; set; }
        /// <summary>
        /// SKU 折扣率：1 = 不打折，0.7 = 7 折。
        /// </summary>
        public decimal Price { get; set; }
    }
}
