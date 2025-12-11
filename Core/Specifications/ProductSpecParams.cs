namespace Core.Specifications;

public class ProductSpecParams
{
    private const int MaxPageSize = 50;
    public int PageIndex { get; set; } = 1;

    private int _pageSize = 6;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }
    

    private List<String> _brands = [];
    public List<String> Brands
    {
        get => _brands; // types = boards,gloves
        set 
        { 
            _brands = value.SelectMany( x => x.Split(',', StringSplitOptions.RemoveEmptyEntries)).ToList(); 
        }
    }

    private List<String> _types = [];
    public List<String> Types
    {
        get => _types; // types = boards,gloves
        set 
        { 
            _types = value.SelectMany( x => x.Split(',', StringSplitOptions.RemoveEmptyEntries)).ToList(); 
        }
    }
    
    public string? Sort { get; set; }

    private string? _search;
    public string? Search
    {
        get => _search ?? "";
        set => _search = value?.ToLower();
    }
    
}
