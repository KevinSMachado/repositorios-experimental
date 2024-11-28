namespace TK_ENERGY_GP_PORTAL.Services.Contracts
{
    public interface IGlobalService<T>
    {
        Task<T> GetById(int id);
        Task<IEnumerable<T>> GetAll();
        Task<T> Create(T entity);
        Task<T> Update(T entity);
        Task<T> Delete(T entity);
    }
}
