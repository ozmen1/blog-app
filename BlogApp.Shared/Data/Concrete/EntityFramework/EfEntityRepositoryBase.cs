using BlogApp.Shared.Data.Abstract;
using BlogApp.Shared.Entities.Abstract;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BlogApp.Shared.Data.Concrete.EntityFramework
{
    public class EfEntityRepositoryBase<TEntity> : IEntityRepository<TEntity>
        where TEntity : class,
        IEntity,
        new()
    {
        private readonly DbContext _context;

        public EfEntityRepositoryBase(DbContext context)
        {
            _context = context;
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {
            await _context.Set<TEntity>().AddAsync(entity);
            return entity;
        }

        public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _context.Set<TEntity>().AnyAsync(predicate);
        }

        public async Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _context.Set<TEntity>().CountAsync(predicate);
        }

        public async Task DeleteAsync(TEntity entity)
        {
            await Task.Run(() => { _context.Set<TEntity>().Remove(entity); }); 
        }

        public async Task<TEntity> UpdateAsync(TEntity entity)
        {
            await Task.Run(() => { _context.Set<TEntity>().Update(entity); });
            return entity;
        }

        public async Task<IList<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> predicate = null, params Expression<Func<TEntity, object>>[] includeProperties)
        {
            //Burada contextimize erişip, hangi entity ile çalışacaksak o entityi IQueryble tipinde alıyoruz. Ki sonra bunun arkasına Where, Inlcude gibi yapıları duruma göre ekleyebilelim.
            IQueryable<TEntity> query = _context.Set<TEntity>();
            
            //Bu metoda gelen birinci parametre yani predicate eğer null değilse, bu bir koşul belirtilmiş demektir. Dolayısıyla bu durumda o koşulu(predicate) if içinde Where ile query üzerine ekliyorum. Eğer predicate null ise query üzerine Where ile ilgili bir şey eklememize gerek yok!
            if (predicate != null)
            {
                query = query.Where(predicate);
            }
            //Eğer ikinci parametremiz olan includeProperties dizisinde eleman varsa, bu dizi içinde dönerek her elemanı query'e ekliyoruz. Ki her eleman bir Include taşıyor. Burası da bittiğinde artık ToList yapılabilir halde bir query elimizde olacak.
            if (includeProperties.Any())
            {
                foreach (var includeProperty in includeProperties)
                {
                    query = query.Include(includeProperty);
                }
            }
            //Artık ToListAsync yapılabilecek query elimizde. Biz de geriye döndüreceğimiz query'yi ToListAsync ile listeye çeviriyoruz çünkü bu metot geriye bir liste döndürmesi gerekiyor.
            return await query.ToListAsync();
        }
        //Article article = repositoryArticle.GetAllAsync(x=>x.CategoryId==12, y=>y.User, y=>y.Comments, z=>z.Role)
        public async Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includeProperties)
        {
            IQueryable<TEntity> query = _context.Set<TEntity>();
            query = query.Where(predicate);
            if (includeProperties.Any())
            {
                foreach (var includeProperty in includeProperties)
                {
                    query = query.Include(includeProperty);
                }
            }
            return await query.FirstOrDefaultAsync();
            //return await query.SingleOrDefaultAsync();

        }


    }
}
