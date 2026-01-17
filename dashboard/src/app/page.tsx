'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  VStack,
  HStack,
  Icon,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { FaDiscord, FaServer, FaUsers, FaCog } from 'react-icons/fa';

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <Card.Root>
      <Card.Body>
        <Flex align="center">
          <Box p={3} borderRadius="lg" bg="brand.500" color="white">
            <Icon as={icon} boxSize={6} />
          </Box>
          <Spacer />
          <VStack align="end" gap={0}>
            <Text fontSize="sm" color="gray.500">
              {title}
            </Text>
            <Heading size="lg">{value}</Heading>
          </VStack>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}

export default function DashboardPage() {
  return (
    <Box minH="100vh" bg="gray.900">
      {/* Header */}
      <Box bg="gray.800" borderBottomWidth="1px" borderColor="gray.700">
        <Container maxW="container.xl" py={4}>
          <Flex align="center">
            <HStack gap={3}>
              <Icon as={FaDiscord} boxSize={8} color="brand.500" />
              <Heading size="lg" color="white">
                {{APP_TITLE}}
              </Heading>
            </HStack>
            <Spacer />
            <Button colorScheme="brand" leftIcon={<FaDiscord />}>
              Login with Discord
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            <StatCard title="Total Servers" value="0" icon={FaServer} />
            <StatCard title="Total Users" value="0" icon={FaUsers} />
            <StatCard title="Commands Used" value="0" icon={FaCog} />
            <StatCard title="Uptime" value="99.9%" icon={FaDiscord} />
          </SimpleGrid>

          {/* Welcome Card */}
          <Card.Root>
            <Card.Body>
              <VStack gap={4} textAlign="center" py={8}>
                <Icon as={FaDiscord} boxSize={16} color="brand.500" />
                <Heading size="xl">Welcome to {{APP_TITLE}}</Heading>
                <Text color="gray.400" maxW="md">
                  Manage your Discord bot settings, view analytics, and
                  configure server-specific options from this dashboard.
                </Text>
                <HStack gap={4} pt={4}>
                  <Button colorScheme="brand" size="lg">
                    Get Started
                  </Button>
                  <Button variant="outline" size="lg">
                    View Documentation
                  </Button>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Quick Actions */}
          <Box>
            <Heading size="md" mb={4} color="white">
              Quick Actions
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <Card.Root _hover={{ borderColor: 'brand.500' }} cursor="pointer">
                <Card.Body>
                  <VStack gap={3}>
                    <Icon as={FaServer} boxSize={8} color="brand.500" />
                    <Heading size="sm">Manage Servers</Heading>
                    <Text fontSize="sm" color="gray.400" textAlign="center">
                      Configure bot settings for your Discord servers
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root _hover={{ borderColor: 'brand.500' }} cursor="pointer">
                <Card.Body>
                  <VStack gap={3}>
                    <Icon as={FaCog} boxSize={8} color="brand.500" />
                    <Heading size="sm">Commands</Heading>
                    <Text fontSize="sm" color="gray.400" textAlign="center">
                      Enable or disable commands per server
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root _hover={{ borderColor: 'brand.500' }} cursor="pointer">
                <Card.Body>
                  <VStack gap={3}>
                    <Icon as={FaUsers} boxSize={8} color="brand.500" />
                    <Heading size="sm">User Management</Heading>
                    <Text fontSize="sm" color="gray.400" textAlign="center">
                      View and manage bot users and permissions
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>

      {/* Footer */}
      <Box bg="gray.800" borderTopWidth="1px" borderColor="gray.700" mt={16}>
        <Container maxW="container.xl" py={6}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
          >
            <Text color="gray.500" fontSize="sm">
              &copy; {new Date().getFullYear()} {{APP_TITLE}}. All rights
              reserved.
            </Text>
            <HStack gap={4} mt={{ base: 4, md: 0 }}>
              <Button variant="ghost" size="sm">
                Documentation
              </Button>
              <Button variant="ghost" size="sm">
                Support
              </Button>
              <Button variant="ghost" size="sm">
                GitHub
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}