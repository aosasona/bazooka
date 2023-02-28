package system

import (
	mem "github.com/shirou/gopsutil/v3/mem"
)

type Stat struct {
	Raw     float64 `json:"raw"`
	Percent float64 `json:"percent"`
}

type MemoryStats struct {
	Total     Stat `json:"total"`
	Available Stat `json:"available"`
	Used      Stat `json:"used"`
}

func GetMemoryStats() (MemoryStats, error) {

	var stats MemoryStats

	fullStats, err := mem.VirtualMemory()

	if err != nil {
		return stats, err
	}

	stats.Total = Stat{
		Raw:     toGigabyte(fullStats.Total),
		Percent: 100,
	}
	stats.Available = Stat{
		Raw:     toGigabyte(fullStats.Available),
		Percent: calculatePercentage(fullStats.Total, fullStats.Available),
	}
	stats.Used = Stat{
		Raw:     toGigabyte(fullStats.Used),
		Percent: calculatePercentage(fullStats.Total, fullStats.Used),
	}

	return stats, nil
}
