package system

import (
	"math"

	"github.com/shirou/gopsutil/v3/cpu"
)

type CPUStats struct {
	PhysicalCores int     `json:"physical_cores"`
	LogicalCores  int     `json:"logical_cores"`
	TotalUsage    float64 `json:"total_usage"`
}

func GetCPUStats() (CPUStats, error) {
	var (
		stats CPUStats
		err   error
	)

	stats.LogicalCores, err = cpu.Counts(true)
	if err != nil {
		return stats, err
	}

	stats.PhysicalCores, err = cpu.Counts(false)
	if err != nil {
		return stats, err
	}

	totalUsage, err := cpu.Percent(0, false)
	if err != nil || len(totalUsage) < 1 {
		return stats, err
	}
	stats.TotalUsage = math.Round(totalUsage[0]*100) / 100

	return stats, nil
}
