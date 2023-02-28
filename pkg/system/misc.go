package system

import "math"

// returns the percentage to 2 decimal places as a float
func calculatePercentage[T float64 | uint64](total, value T) float64 {
	return math.Round(((float64(value)/float64(total))*100)*100) / 100
}

func toGigabyte(valInBytes uint64) float64 {
	return math.Round((float64(valInBytes)/1000000000)*100) / 100
}
