using Microsoft.EntityFrameworkCore;

namespace RootkitAuth.API.Data;

public class ProgramEntryDbContext : DbContext
{
    public ProgramEntryDbContext(DbContextOptions<ProgramEntryDbContext> options) : base(options)
    {
    }

    public DbSet<ProgramEntry> ProgramEntries => Set<ProgramEntry>();
}
