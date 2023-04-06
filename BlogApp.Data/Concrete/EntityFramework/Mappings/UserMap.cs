using BlogApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlogApp.Data.Concrete.EntityFramework.Mappings
{
    public class UserMap : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Id).ValueGeneratedOnAdd();

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(50);
            builder.HasIndex(u => u.Email).IsUnique(); //Benzersiz değer özelliği

            builder.Property(u => u.UserName)
                .IsRequired()
                .HasMaxLength(20);
            builder.HasIndex(u => u.UserName).IsUnique(); //Benzersiz değer özelliği

            builder.Property(u=>u.Description).HasMaxLength(500);

            builder.Property(u => u.FirstName)
                .IsRequired()
                .HasMaxLength(30);

            builder.Property(u => u.LastName)
                .IsRequired()
                .HasMaxLength(30);

            builder.Property(u => u.Picture)
                .IsRequired()
                .HasMaxLength(250);

            builder.Property(u => u.CreatedByName)
                            .IsRequired()
                            .HasMaxLength(50);

            builder.Property(u => u.ModifiedByName)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.CreatedDate).IsRequired();

            builder.Property(u => u.ModifiedDate).IsRequired();

            builder.Property(u => u.IsActive).IsRequired();

            builder.Property(u => u.IsDeleted).IsRequired();

            builder.Property(u => u.Note).HasMaxLength(500);

            builder.Property(u => u.PasswordHash)
                .IsRequired()
                .HasColumnType("VARBINARY(500)");

            builder.HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);

            builder.ToTable("Users");

            //İlk User verileri ekleniyor
            builder.HasData(
                new User
                {
                    Id = 1,
                    RoleId=1,
                    FirstName="Deniz",
                    LastName="Gezen",
                    UserName="denizgezen",
                    Email="denizgezen@gmail.com",
                    Description="İlk admin kullanıcısı",
                    Picture= "https://www.teknozum.com/wp-content/uploads/2019/12/whatsapp-profil-foto%C4%9Fraflar%C4%B1-17-1024x1024.jpg",
                    IsActive = true,
                    IsDeleted = false,
                    CreatedByName = "InitialCreated",
                    CreatedDate = DateTime.Now,
                    ModifiedByName = "InitialCreated",
                    ModifiedDate = DateTime.Now,
                    Note = "Admin kullanıcısı.",
                    PasswordHash=Encoding.ASCII.GetBytes("200820e3227815ed1756a6b531e7e0d2") //qwe123 şifremizin hashlenmiş hali.
                },
                new User
                {
                    Id = 2,
                    RoleId = 2,
                    FirstName = "Yusuf",
                    LastName = "Onan",
                    UserName = "yusufonan",
                    Email = "yusufonan@gmail.com",
                    Description = "İlk user kullanıcısı",
                    Picture = "https://tasarimfikir.com/wp-content/uploads/profil-fotografi-tasarimi-min.jpg",
                    IsActive = true,
                    IsDeleted = false,
                    CreatedByName = "InitialCreated",
                    CreatedDate = DateTime.Now,
                    ModifiedByName = "InitialCreated",
                    ModifiedDate = DateTime.Now,
                    Note = "User kullanıcısı.",
                    PasswordHash = Encoding.ASCII.GetBytes("46f94c8de14fb36680850768ff1b7f2a") //123qwe şifremizin hashlenmiş hali.
                });
        }
    }
}
