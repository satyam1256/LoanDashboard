"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface FilterState {
    search: string
    maxApr: number
    minIncome: number
    minCreditScore: number
}

interface ProductFiltersProps {
    filters: FilterState
    setFilters: (filters: FilterState) => void
    banks: string[]
}

export function ProductFilters({ filters, setFilters, banks }: ProductFiltersProps) {

    const handleChange = (key: keyof FilterState, value: any) => {
        setFilters({ ...filters, [key]: value })
    }

    const clearFilters = () => {
        setFilters({
            search: "",
            maxApr: 20,
            minIncome: 0,
            minCreditScore: 0
        })
    }

    return (
        <Card className="h-fit sticky top-20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Filters</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 lg:px-3 text-xs">
                    Reset <X className="ml-2 h-3 w-3" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Bank Search */}
                <div className="space-y-2">
                    <Label htmlFor="search">Bank Name</Label>
                    <Input
                        id="search"
                        placeholder="Search bank..."
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                    />
                </div>

                {/* Max APR Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Max APR</Label>
                        <span className="text-xs text-muted-foreground">{filters.maxApr}%</span>
                    </div>
                    <Slider
                        defaultValue={[filters.maxApr]}
                        max={25}
                        min={5}
                        step={0.5}
                        onValueChange={(vals) => handleChange('maxApr', vals[0])}
                    />
                </div>

                {/* Min Income */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Min Income (₹)</Label>
                        <span className="text-xs text-muted-foreground">₹{filters.minIncome.toLocaleString()}</span>
                    </div>
                    <Slider
                        defaultValue={[filters.minIncome]}
                        max={100000}
                        min={0}
                        step={5000}
                        onValueChange={(vals) => handleChange('minIncome', vals[0])}
                    />
                </div>

                {/* Credit Score */}
                <div className="space-y-2">
                    <Label>Credit Score Required</Label>
                    <Select
                        value={filters.minCreditScore.toString()}
                        onValueChange={(val) => handleChange('minCreditScore', parseInt(val))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Minimum Score" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Any</SelectItem>
                            <SelectItem value="600">600+</SelectItem>
                            <SelectItem value="650">650+</SelectItem>
                            <SelectItem value="700">700+</SelectItem>
                            <SelectItem value="750">750+ (Excellent)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </CardContent>
        </Card>
    )
}
