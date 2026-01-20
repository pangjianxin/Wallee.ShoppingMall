using Microsoft.Extensions.AI;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.ObjectMapping;
using Wallee.Mall.Products.Dtos;

namespace Wallee.Mall.Products.Tools
{
    public sealed class ProductTools(
        IProductRepository productRepository,
        IObjectMapper objectMapper) : ITransientDependency
    {
        [Description("Search products in the mall catalog by keyword, with optional tag/attribute filters. Use this to find candidate products for recommendation/comparison or to fetch factual product data. Inputs are treated as filters; leave optional fields null if not needed.")]
        public async Task<List<ProductDto>> SearchAsync(
            [Description("Required. Free-text keyword for searching product name/brand/summary. Examples: '电脑', '卫生纸', '咖啡'.")] string keyWord,
            [Description("Optional. SKU attribute key to filter by specification key. Examples: '颜色', '尺寸', '配置', '容量'.")] string? attributeKey = null,
            [Description("Optional. SKU attribute value that matches the given attributeKey. Examples: '红色', '42', '256G', '1L'.")] string? attributeValue = null)
        {
            var entities = await productRepository.SearchAsync(keyWord, attributeKey, attributeValue);
            return objectMapper.Map<List<Product>, List<ProductDto>>(entities);
        }

        public IEnumerable<AITool> AsAITools()
        {
            yield return AIFunctionFactory.Create(SearchAsync, "product_search");
        }
    }
}
