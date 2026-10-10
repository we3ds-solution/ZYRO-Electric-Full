using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration for UserClaim entity
/// </summary>
public class UserClaimConfiguration : IEntityTypeConfiguration<UserClaim>
{
    public void Configure(EntityTypeBuilder<UserClaim> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.UserId)
            .IsRequired();

        builder.Property(c => c.ClaimType)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(c => c.ClaimValue)
            .IsRequired()
            .HasMaxLength(1024);

        builder.HasIndex(c => c.UserId)
            .HasDatabaseName("IX_UserClaims_UserId");

        builder.HasOne(c => c.User)
            .WithMany(u => u.UserClaims)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.ToTable("UserClaims");
    }
}
