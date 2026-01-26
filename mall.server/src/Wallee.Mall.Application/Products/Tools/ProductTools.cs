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
        [Description("该工具用于检索系统中记录的商品信息，主要用关键字检索，还有可选的SKU键值信息")]
        public async Task<List<ProductDto>> SearchAsync(
            [Description("必填。用于搜索产品名称/品牌/摘要的自由文本关键词。例如: '电脑', '戴尔', '餐巾纸'。")] string keyWord,
            [Description("选填。用于过滤SKU键信息的关键词。例如: '颜色', '尺寸', '配置', '容量'.")] string? attributeKey = null,
            [Description("选填。用于命中SKU值信息的关键词。例如：'红色', '42', '256G', '1L'.")] string? attributeValue = null)
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
