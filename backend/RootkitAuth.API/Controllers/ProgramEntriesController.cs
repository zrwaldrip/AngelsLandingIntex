using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using RootkitAuth.API.Data;

namespace RootkitAuth.API.Controllers;

[Route("api/program-entries")]
[ApiController]
public class ProgramEntriesController(ProgramEntryDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public IActionResult GetProgramEntries(
        [FromQuery] int pageSize = 10,
        [FromQuery] int pageNum = 1,
        [FromQuery] List<string>? programAreas = null)
    {
        pageSize = Math.Clamp(pageSize, 1, 50);
        pageNum = Math.Max(pageNum, 1);

        var query = dbContext.ProgramEntries.AsNoTracking().AsQueryable();

        if (programAreas is { Count: > 0 })
        {
            query = query.Where(entry =>
                entry.Container != null && programAreas.Contains(entry.Container));
        }

        var totalCount = query.Count();
        var entries = query
            .OrderBy(entry => entry.RootbeerName)
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new
        {
            entries,
            totalCount
        });
    }

    [HttpGet("program-areas")]
    public IActionResult GetProgramAreas()
    {
        var programAreas = dbContext.ProgramEntries
            .AsNoTracking()
            .Where(entry => !string.IsNullOrWhiteSpace(entry.Container))
            .Select(entry => entry.Container!)
            .Distinct()
            .OrderBy(programArea => programArea)
            .ToList();

        return Ok(programAreas);
    }

    [HttpGet("admin")]
    [Authorize(Policy = AuthPolicies.ManageCatalog)]
    public async Task<IActionResult> GetProgramEntriesForAdmin()
    {
        var entries = await dbContext.ProgramEntries
            .AsNoTracking()
            .OrderBy(entry => entry.RootbeerName)
            .ToListAsync();

        return Ok(entries);
    }
    
    [HttpPost]
    [Authorize(Policy = AuthPolicies.ManageCatalog)]
    public async Task<IActionResult> CreateProgramEntry([FromBody] ProgramEntry entry)
    {
        var nextEntryId = (dbContext.ProgramEntries.Max(e => (int?)e.RootbeerID) ?? 0) + 1;
        entry.RootbeerID = nextEntryId;
        dbContext.ProgramEntries.Add(entry);
        await dbContext.SaveChangesAsync();
        return Created($"/api/program-entries/{entry.RootbeerID}", entry);
    }
}
