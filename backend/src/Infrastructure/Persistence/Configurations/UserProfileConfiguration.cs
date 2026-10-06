using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration for UserProfile entity
/// </summary>
public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.UserId)
            .IsRequired();

        builder.Property(p => p.ProfileName)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(p => p.PhoneNumber)
            .HasMaxLength(50);

        builder.Property(p => p.ProfilePictureUrl)
            .HasMaxLength(1024);

        builder.Property(p => p.Bio)
            .HasMaxLength(1000);

        builder.Property(p => p.Country)
            .HasMaxLength(100);

        builder.Property(p => p.Timezone)
            .HasMaxLength(100);

        builder.Property(p => p.Language)
            .IsRequired()
            .HasMaxLength(10)
            .HasDefaultValue("en");

        builder.HasIndex(p => p.UserId)
            .HasDatabaseName("IX_UserProfiles_UserId");

        builder.HasOne(p => p.User)
            .WithMany(u => u.UserProfiles)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.ToTable("UserProfiles");
    }
}
